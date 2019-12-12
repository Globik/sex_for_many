//export default 
class Signaling {
  headers(sessionId) {
    if(sessionId != undefined)
    {
		console.log(sessionId);
      return {'Content-Type': 'application/json', 'Session-Id': sessionId};
    }
    else {
		
      return {'Content-Type': 'application/json'};
    }
  };

  url(method) {
	  //alert(location.host+' '+location.pathname);
    return location.protocol + '//' + location.host + location.pathname + '/signaling/' + method;
  };
  async createConnection(sessionId) {
	// alert('create connection'+' '+sessionId);
    return await fetch(this.url('connection'), {method: 'PUT', headers: this.headers(sessionId)});
  };
  async deleteConnection(sessionId, connectionId) {
    const data = {'connectionId' : connectionId };
    return await fetch(this.url('connection'), {method: 'DELETE', headers: this.headers(sessionId), body: JSON.stringify(data)});
  };
  async sendOffer(sessionId, connectionId, sdp) {
	 // alert('send offer '+sessionId+connectionId);
    const data = {'sdp' : sdp, 'connectionId' : connectionId };
    return await fetch(this.url('offer'), {method: 'POST', headers: this.headers(sessionId), body: JSON.stringify(data)});
  };
  async sendAnswer(sessionId, connectionId, sdp) {
    const data = {'sdp' : sdp, 'connectionId' : connectionId };
    return await fetch(this.url('answer'), {method: 'POST', headers: this.headers(sessionId), body: JSON.stringify(data)});
  };
  async sendCandidate(sessionId, connectionId, candidate, sdpMid, sdpMLineIndex) {
    const data = {
      'candidate' : candidate,
      'sdpMLineIndex': sdpMLineIndex,
      'sdpMid': sdpMid,
      'connectionId' : connectionId
    };
    return await fetch(this.url('candidate'), {method: 'POST', headers: this.headers(sessionId), body: JSON.stringify(data)});
  };
  async create() {
	 // alert(this.headers())
    let b=await fetch(this.url('suka'), {method: 'GET', headers: this.headers()});
    console.warn('b',b)
    //alert(JSON.stringify(b));
    
    return b;
  };
  
  
  
  async delete(sessionId) {
    return await fetch(this.url(''), {method: 'DELETE', headers: this.headers(sessionId)});
  };
  async getOffer(sessionId, fromTime = 0) {
    return await fetch(this.url(`offer?fromtime=${fromTime}`), {method: 'GET', headers: this.headers(sessionId)});
  };
  async getAnswer(sessionId, fromTime = 0) {
	 // alert('get answer')
    return await fetch(this.url(`answer?fromtime=${fromTime}`), {method: 'GET', headers: this.headers(sessionId)});
  };
  async getCandidate(sessionId, fromTime = 0) {
    return await fetch(this.url(`candidate?fromtime=${fromTime}`), {method: 'GET', headers: this.headers(sessionId)});
  };
}

