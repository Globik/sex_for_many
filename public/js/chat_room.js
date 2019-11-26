window.onload = function() {
         let xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function($evt){
            if(xhr.readyState == 4 && xhr.status == 200){
                //let res = JSON.parse(xhr.responseText);
                //console.log("response: ",res);
                alert(this.response);
            }else{alert('g '+this.response);}
         }
         xhr.open("POST","https://global.xirsys.net/_turn/alikon",true);
        xhr.setRequestHeader("Authorization", "Basic"+btoa("Globi:867f06f6-1065-11ea-a46b-0242ac110003"));
        xhr.setRequestHeader("Content-Type", "application/json");
         xhr.send(JSON.stringify({"format":"urls"}));
      }

