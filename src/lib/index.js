import 'whatwg-fetch';
import wx from 'weixin-js-sdk';

window.wx = wx;
window.jWeixin = wx;

/**
 * 开启debug 模式
 * @description 地址添加debug=true开启debug模式
 */
const openDebug = (isDebug) => {
  const debug = window.location.href.indexOf('debug=true');
  if (debug > -1 || isDebug) {
    const sc = document.createElement('script');
    sc.src = 'https://wechatfe.github.io/vconsole/lib/vconsole.min.js?v=3.2.0';
    sc.crossorigin = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(sc, s);
    sc.onload = () => {
      window.vConsole = new window.VConsole();
    };
  }
};

/**
 * @function errorReport
 * @desc 错误输出
 * @memberof WechatJSSDK
 * @param {Object} msg
 * @example  errorReport(msg)
 */
const errorReport = (msg) => {
  /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  console.error('[Wechat-Jssdk Module]', msg);
};

/**
 * @function getQueryString
 * @param {string} name
 * @desc 获取url参数
 */
const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * @function setNativeTitle
 * @desc 设置标题
 * @param {string} title
 */
const setNativeTitle = (title) => {
  document.title = title;
  const mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // iframe.setAttribute('src', '');
    const iframeCallback = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);
  }
};

class WechatJSSDK {
  constructor(param) {
    const {
      ticketUrl, ticketConfig, ticketSuccess,
      imgUrl, link, title, desc, hideMenu, appId, debug, jsApiList,
    } = param;
    this.ticket = {
      config: ticketConfig,
      url: ticketUrl,
      success: ticketSuccess,
    };
    this.state = {
      imgUrl,
      link: link || window.location.href,
      title: title || document.title,
      desc: desc || document.title,
      hideMenu: hideMenu || false,
      appId: appId || '',
      debug: debug || false,
      jsApiList: jsApiList || [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'onVoicePlayEnd',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'translateVoice',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
      ],
    };
    this.init();
    this.readyState = false;
  }

  /**
   * @function setState
   * @desc 设置配置参数
   * @param {String} key
   * @param {all} val
   * @returns this
   * @memberof WechatJSSDK
   */
  setState(key, val) {
    this.state[key] = val;
    return this;
  }

  /**
   * @function getState
   * @desc 读取配置参数
   * @param {String} key
   * @returns val
   * @memberof WechatJSSDK
   */
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  /**
   * @function update
   * @memberof WechatJSSDK
   * @desc 配置参数后更新分享事件
   */
  update() {
    if (this.readyState) {
      this.ready();
    } else {
      this.on('upReady', () => {
        this.ready();
      });
    }
  }

  /**
   * 注册事件执行
   * @param {String} type 已注册事件类型
   * @param {Function} data 回调参数
   */
  emit(type, data) {
    const callback = this.event[type];
    if (typeof callback !== 'undefined') {
      callback(data);
    }
  }

  /**
   * @function on
   * @memberof WechatJSSDK
   * @desc 事件注册
   * @param {String} type 事件类型。目前支持 ready与error事件及分享成功回调
   * @param {Function} callback
   */
  on(type, callback) {
    if (typeof callback === 'function' && typeof type === 'string') {
      if (typeof this.event[type] === 'undefined') {
        this.event[type] = () => {};
      }
      this.event[type] = callback;
    }
  }

  /**
   * @function removeEventType
   * @memberof WechatJSSDK
   * @desc 事件移除
   * @param {String} type 已注册事件类型
   * @example removeEvent('type')
   */
  removeEventType(type) {
    const callback = this.event[type];
    if (typeof callback !== 'undefined') {
      this.event[type] = () => {};
    }
  }

  /**
   * @function getTicket
   * @desc 获取 签名算法
   * @memberof WechatJSSDK
   */
  async getTicket() {
    const { config, url, success } = this.ticket;
    if (!url) {
      errorReport('权限签名算法 > 请求地址为空');
      return;
    }
    if (!success || typeof success !== 'function') {
      errorReport('权限签名算法 > 成功回调方法为空');
      return;
    }
    try {
      const response = await window.fetch(url, config || {});
      const res = await response.json();
      const data = success(res);
      this.config(data);
    } catch (error) {
      errorReport(error);
    }
  }

  /**
   * @function config
   * @desc 调用该方法进行 jssdk 配置
   * @memberof WechatJSSDK
   */
  config(data) {
    // 获取签名
    const { debug, appId, jsApiList } = this.state;
    const { timestamp, nonceStr, signature } = data;
    wx.config({
      debug,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList,
    });
    wx.ready(() => {
      this.ready();
      this.readyState = true;
      setTimeout(() => {
        this.emit('ready');
        this.emit('upReady');
      }, 0);
    });
    wx.error((res) => {
      errorReport(res);
      setTimeout(() => {
        this.emit('error', res);
      }, 0);
    });
  }

  /**
   * @function ready
   * @memberof WechatJSSDK
   * @desc 分享事件注册
   */
  ready() {
    const {
      hideMenu, title, desc, link, imgUrl,
    } = this.state;
    if (hideMenu) {
      wx.hideOptionMenu();
    } else {
      // const that = this;
      const param = {
        title: title || desc,
        desc,
        link,
        imgUrl,
      };
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        ...param,
        success: () => {
          this.emit('shareTimeline');
        },
        fail: (err) => {
          errorReport(err);
        },
      });
      // 分享给朋友
      wx.onMenuShareAppMessage({
        ...param,
        success: () => {
          this.emit('shareAppMessage');
        },
        fail: (err) => {
          errorReport(err);
        },
      });
      // 分享到QQ
      wx.onMenuShareQQ({
        ...param,
        success: () => {
          this.emit('shareQQ');
        },
        fail: (err) => {
          errorReport(err);
        },
      });
      // 分享到微博
      wx.onMenuShareWeibo({
        ...param,
        success: () => {
          this.emit('shareWeibo');
        },
        fail: (err) => {
          errorReport(err);
        },
      });
      // 分享到QZone
      wx.onMenuShareQZone({
        ...param,
        success: () => {
          this.emit('shareQzone');
        },
        fail: (err) => {
          errorReport(err);
        },
      });
    }
  }

  /**
   * @desc 初始化配置jssdk
   * @example
   */
  init() {
    // 事件注册存储
    this.event = {};
    this.getTicket();
    openDebug(this.state.debug);
    this.getQueryString = getQueryString;
    this.setNativeTitle = setNativeTitle;
  }
}

export default WechatJSSDK;
