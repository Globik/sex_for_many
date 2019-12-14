//import Signaling from "./signaling.js"

//export 
class VideoPlayer {
  constructor(element, config) {
    const _this = this;
    this.cfg = VideoPlayer.getConfiguration(config);
    this.pc = null;
    this.channel = null;
    this.offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
    this.video = element;
    this.video.playsInline = true;
    this.video.addEventListener('loadedmetadata', function () {
      _this.video.play();
      _this.resizeVideo();
    }, true);
    this.interval = 3000;
    this.signaling = new Signaling();
    this.ondisconnect = function(){};
    this.sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
    this.sessionId=null;
  }

  static getConfiguration(config) {
    if(config === undefined) {
      config = {};
    }
    
    
    var bona=[{urls: [
		"turn:bturn2.xirsys.com:80?transport=udp",
		"turn:bturn2.xirsys.com:3478?transport=udp",
"turn:bturn2.xirsys.com:80?transport=tcp",
"turn:bturn2.xirsys.com:3478?transport=tcp",
"turns:bturn2.xirsys.com:443?transport=tcp",
"turns:bturn2.xirsys.com:5349?transport=tcp"
],
"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ==",
"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"},{urls:"stun:bturn2.xirsys.com"}];

    
    var us={"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ=="}
   var cred={"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"}
    config.sdpSemantics = 'unified-plan';
    config.iceServers = bona;
    
 //var us={"username":"7tHAeL19_JqQHTtz5gpoms-AN8xmFtxKaI6K6vWKnS0gSq_eaM4VIvUg7QIy7cBEAAAAAF3dWNVHbG9iaQ=="}
var urli=[
"stun:bturn2.xirsys.com",
"turn:bturn2.xirsys.com:80?transport=udp",
"turn:bturn2.xirsys.com:3478?transport=udp",
"turn:bturn2.xirsys.com:80?transport=tcp",
"turn:bturn2.xirsys.com:3478?transport=tcp",
"turns:bturn2.xirsys.com:443?transport=tcp",
"turns:bturn2.xirsys.com:5349?transport=tcp"
]
//var cred={"credential":"73029f68-106d-11ea-85f6-9646de0e6ccd"}
    
    //config.iceServers = [{urls:urli},us,cred];
    
    return config;
  }

  async setupConnection() {
	  //alert('setyp connecton');
    const _this = this;
    // close current RTCPeerConnection
    if (this.pc) {
      console.log('Close current PeerConnection');
      this.pc.close();
      this.pc = null;
    }

    // RTCDataChannel don't work on iOS safari
    // https://github.com/webrtc/samples/issues/1123
    if (
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)
    ) {
      let stream = await navigator.mediaDevices.getUserMedia({audio: true});
      stream.getTracks().forEach(t => t.stop());
    }

    // Create peerConnection with proxy server and set up handlers
    this.pc = new RTCPeerConnection(this.cfg);
    this.pc.onsignalingstatechange = function (e) {
      console.log('signalingState changed:', e);
    };
    this.pc.oniceconnectionstatechange = function (e) {
      console.log('iceConnectionState changed:', e);
      console.log('pc.iceConnectionState:' + _this.pc.iceConnectionState);
      if(_this.pc.iceConnectionState === 'disconnected') {
        _this.ondisconnect();
      }
    };
    this.pc.onicegatheringstatechange = function (e) {
      console.log('iceGatheringState changed:', e);
    };
    this.pc.ontrack = function (e) {
      console.log('New track added: ', e.streams);
      _this.video.srcObject = e.streams[0];
    };
    this.pc.onicecandidate = function (e) {
      if(e.candidate != null) {
        _this.signaling.sendCandidate(_this.sessionId, _this.connectionId, e.candidate.candidate, e.candidate.sdpMid, e.candidate.sdpMLineIndex);
      }
    };
    // Create data channel with proxy server and set up handlers
    this.channel = this.pc.createDataChannel('data');
    this.channel.onopen = function () {
      console.log('Datachannel connected.');
    };
    this.channel.onerror = function (e) {
      console.log("The error " + e.error.message + " occurred\n while handling data with proxy server.");
    };
    this.channel.onclose = function () {
      console.log('Datachannel disconnected.');
    };

    const createResponse = await this.signaling.create();
    const data = await createResponse.json();
   //alert('data from'+JSON.stringify(data));
    this.sessionId = data.sessionId;

    // create offer
    const offer = await this.pc.createOffer(this.offerOptions);

    await this.createConnection();
    console.log('set local sdp');
    offer.sdp = offer.sdp.replace(/useinbandfec=1/, 'useinbandfec=1;stereo=1;maxaveragebitrate=1048576');
    const desc = new RTCSessionDescription({sdp:offer.sdp, type:"offer"});
    await this.pc.setLocalDescription(desc);
    //alert(offer);
    await this.sendOffer(offer);
  };

  async createConnection() {
    // signaling
   // alert('this.sessionId '+this.sessionId);
    const res = await this.signaling.createConnection(this.sessionId);
    console.error('res ',res);
    const data = await res.json();
    //alert('data: '+JSON.stringify(data));
    this.connectionId = data.connectionId;
  }

  async sendOffer(offer) {
  //  alert('sig offer '+this.sessionId);
    await this.signaling.sendOffer(this.sessionId, this.connectionId, offer.sdp);
    this.loopGetAnswer(this.sessionId, this.interval);
    this.loopGetCandidate(this.sessionId, this.interval);
  }

  async loopGetAnswer(sessionId, interval) {
    console.log('***********receive answer message from 30secs ago ***',sessionId, interval);
    let lastTimeRequest = Date.now() - 30000;
//alert('loop get answer');
    while(true) {
      const res = await this.signaling.getAnswer(sessionId, lastTimeRequest);
     // alert(JSON.stringify(res));
      const data = await res;//.json();
      console.log('data ',data);
     // alert(data.answers);
      const answers = data.answers;
      lastTimeRequest = Date.parse(res.headers.get('Date'));

      if(answers && answers.length > 0) {
        const answer = answers[0];
        await this.setAnswer(sessionId, answer.sdp);
      }
      await this.sleep(interval);
    }
  }

  async loopGetCandidate(sessionId, interval) {
    // receive answer message from 30secs ago
    let lastTimeRequest = Date.now() - 30000;
    console.log("loop get candidate");
//alert(sessionId)
    while(true) {
      const res = await this.signaling.getCandidate(sessionId, lastTimeRequest);
      lastTimeRequest = Date.parse(res.headers.get('Date'));
console.log('lastTimeRequest ',lastTimeRequest);
      const data = await res.json();
    //alert('data in loop get candidate '+JSON.stringify(data));
      const candidates = data.candidates.filter(v => v.connectionId = this.connectionId);
      if(candidates.length > 0) {
        for(let candidate of candidates[0].candidates) {
          const iceCandidate = new RTCIceCandidate({ candidate: candidate.candidate, sdpMid: candidate.sdpMid, sdpMLineIndex: candidate.sdpMLineIndex});
          await this.pc.addIceCandidate(iceCandidate);
        }
      }
      await this.sleep(interval);
    }
  }

  async setAnswer(sessionId, sdp) {
    const desc = new RTCSessionDescription({sdp:sdp, type:"answer"});
    await this.pc.setRemoteDescription(desc);
  }

  resizeVideo() {
    const clientRect = this.video.getBoundingClientRect();
    const videoRatio = this.videoWidth / this.videoHeight;
    const clientRatio = clientRect.width / clientRect.height;

    this._videoScale = videoRatio > clientRatio ? clientRect.width / this.videoWidth : clientRect.height / this.videoHeight;
    const videoOffsetX = videoRatio > clientRatio ? 0 : (clientRect.width - this.videoWidth * this._videoScale) * 0.5;
    const videoOffsetY = videoRatio > clientRatio ? (clientRect.height - this.videoHeight * this._videoScale) * 0.5 : 0;
    this._videoOriginX = clientRect.left + videoOffsetX;
    this._videoOriginY = clientRect.top + videoOffsetY;
  }

  get videoWidth() {
    return this.video.videoWidth;
  }

  get videoHeight() {
    return this.video.videoHeight;
  }

  get videoOriginX() {
    return this._videoOriginX;
  }

  get videoOriginY() {
    return this._videoOriginY;
  }

  get videoScale() {
    return this._videoScale;
  }

  close() {
    if (this.pc) {
      console.log('Close current PeerConnection');
      this.pc.close();
      this.pc = null;
    }
  };

  sendMsg(msg) {
    if(this.channel == null) {
      return;
    }
    switch (this.channel.readyState) {
      case 'connecting':
        console.log('Connection not ready');
        break;
      case 'open':
        this.channel.send(msg);
        break;
      case 'closing':
        console.log('Attempt to sendMsg message while closing');
        break;
      case 'closed':
        console.log( 'Attempt to sendMsg message while connection closed.');
        break;
    }
  };
}
