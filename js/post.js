// console.log("post.js...");
var state;
Send("getK");
function Send(mode,content){	
	var port = chrome.runtime.connect({name:mode}); 
	port.postMessage(content);
	port.onMessage.addListener(function(msg) {	
		// console.log("%c"+msg,"color:green");
		state=msg;
	});	
}




