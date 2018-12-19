$(function () {
  // canvas 实现 watermark
  function __canvasWM({
    // 使用 ES6 的函数默认值方式设置参数的默认取值
    // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
    container = document.body,
    width = '80px',
    height = '80px',
    textAlign = 'center',
    textBaseline = 'middle',
    font = "700 30px Microsoft Yahei",
    fillStyle = 'rgba(184, 184, 184, 0.15)',
    content = '请勿外传',
    rotate = '-45',
    zIndex = 1000,
  } = {}) {
    const args = arguments[0];
    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ctx = canvas.getContext("2d");

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;


    ctx.translate(0, parseFloat(width) / 2);
    ctx.rotate(Math.PI / 180 * rotate);
    ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

    const base64Url = canvas.toDataURL();
    const __wm = document.querySelector('.__wm');

    const watermarkDiv = __wm || document.createElement("div");
    const styleStr = `
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:${zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-image:url('${base64Url}')`;

    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.classList.add('__wm');
    //初始化的时候显示加到页面内但是宽度为0不显示水印
    watermarkDiv.classList.add('watermask_close');

    if (!__wm) {
      container.style.position = 'relative';
      container.insertBefore(watermarkDiv, container.firstChild);
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
      let mo = new MutationObserver(function () {
        const __wm = document.querySelector('.__wm');
        // 只在__wm元素变动才重新调用 __canvasWM
        if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
          // 避免一直触发
          mo.disconnect();
          mo = null;
          __canvasWM(JSON.parse(JSON.stringify(args)));
        }
      });
      mo.observe(container, {
        attributes: true,
        subtree: true,
        childList: true
      })
    }
  }
  if (typeof module != 'undefined' && module.exports) {  //CMD
    module.exports = __canvasWM;
  } else if (typeof define == 'function' && define.amd) { // AMD
    define(function () {
      return __canvasWM;
    });
  } else {
    window.__canvasWM = __canvasWM;
  }

  var s = setInterval(function () {
    if (state) {
      clearInterval(s);
      // console.log(state);
      if (state == "y") {
        // 调用
        __canvasWM({
          content: 'DIG'
        });
        $('.__wm').removeClass('watermask_close').addClass('watermask_open')
      } else {
        $('.__wm').removeClass('watermask_open').addClass('watermask_close')
      }
    }
  }, 100);

  // 监听扩展程序进程或内容脚本发送请求的请求
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.message == "DIG_open") {
        // 调用
        __canvasWM({
          content: 'DIG'
        });
        $('.__wm').removeClass('watermask_close')
        $('.__wm').addClass('watermask_open')
      }
      if (request.message == "DIG_close") {
        $('.__wm').removeClass('watermask_open')
        $('.__wm').addClass('watermask_close')
      }
    }
  );

  if (location.host.indexOf('bi.lietou.com') >= 0) {
    $('body').addClass('change-position')
  }

  //获取background发来的消息
  chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.urlData) {
        let strData = request.urlData.join(' ');
        // console.log(strData)
        if (strData.indexOf(location.host) < 0) {
          state = "n"
        }
      }else{
        state = "n"
      }
    })
}
);








