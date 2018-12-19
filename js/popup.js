//接收后台消息
var bg = chrome.extension.getBackgroundPage();
$('#switch').attr('checked', JSON.parse(bg.status))

if(!localStorage.k){localStorage.k="n";}

$(function () {
  $('#switch').on('change', function () {
    if ($(this).prop('checked') === true) {
		localStorage.k="y";
      //获取当前tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        //向tab发送请求
        chrome.tabs.sendMessage(tab[0].id, {
          message: "DIG_open",
        }, function (response) {
          //popup.js 向background发送消息
          chrome.extension.sendMessage({ msg: true }, function (response) {
            // response 是background 收到消息后的返回数据
          });
        });
      });
    } else {
		localStorage.k="n";
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, {
          message: "DIG_close",
        }, function (response) {
          //popup.js 向background发送消息
          chrome.extension.sendMessage({ msg: false }, function (response) {
            // response 是background 收到消息后的返回数据
          });
        });
      });
    }
  })
})



