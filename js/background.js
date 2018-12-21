chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.browserAction.setPopup({'tabId' : tab.id, 'popup' : 'popup.html'});

  // if (tab.url.indexOf('baidu.com') >= 0) {
    // chrome.browserAction.setPopup({'tabId' : tab.id, 'popup' : 'popup.html'});
  // }else{
  //   chrome.browserAction.setPopup({'tabId' : tab.id, 'popup' : 'not-found.html'});
  // }
  // $.ajax({
  //   type: 'post',
  //   url: '***',
  //   success: function (data) {
  //     if (data.flag == 1) {
  //       let urlData = data.data.domains;
  //       //background向content-script发送消息
  //       chrome.tabs.sendMessage(tabId, { urlData: urlData });
  //       let isShow = urlData.filter(v => tab.url.split('?')[0].includes(v)).length > 0;
  //       // console.log(isShow)
  //       if (isShow) {
  //         chrome.browserAction.setPopup({ 'tabId': tab.id, 'popup': 'popup.html' });
  //       } else {
  //         chrome.browserAction.setPopup({ 'tabId': tab.id, 'popup': 'not-found.html' });
  //       }
  //     } else {
  //       console.log(data.msg)
  //     }
  //   },
  //   error: function (jqueryXHR) {
  //     console.log(jqueryXHR.status)
  //   }
  // });
})

//background 向popup.js发送消息
var status = false;

// background接收来自popup和content_script.js的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
  status = request.msg;
  sendRequest(request.msg)
});

//接收来自post的消息
chrome.runtime.onConnect.addListener(function (port) {
  port = port;
  port.onMessage.addListener(function (msg) {
    if (port.name == 'getK') {
      port.postMessage(localStorage.k);
    };
  });
});


