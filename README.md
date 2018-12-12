# wechat-jssdk

微信JSSDK封装

## 安装
``` bash
npm install @carpenter/wechat-jssdk
```

## 配置

| 成员 | 说明 | 类型 | 是否必须 | 默认值 |
|-----|-----|-----|-----|-----|
| appId | appid | String | 是 | 无 |
| imgUrl | 分享图片地址 | String | 是 | 无 |
| link | 分享图片 | String | 是 | window.location.href |
| title | 分享标题 | String | 是 | 无 |
| desc | 分享描述 | String | 是 | 无 |
| hideMenu | 隐藏菜单 | Boolean | 是 | false |
| debug | debug | Boolean | 是 | false |
| ticketUrl | 获取签名api地址 | String | 是 | 无 |
| ticketConfig | 请求配置 | Object | 是 | {} |
| ticketSuccess | 请求成功回调 | Function | 是 | 无 |


<br>

## 示例
``` js
import WechatJSSDK from '@carpenter/wechat-jssdk'

const wechat = new WechatJSSDK({
  appId: 'wxxxxxxxxxxxxx',
  imgUrl: 'http://stor.xxx.xxx',
  link: '',
  title: '我是分享标题',
  desc: '我是分享描述',
  hideMenu: false,
  debug: false,
  ticketUrl: 'http://xxx.com/api/get_jsticket',
  ticketConfig: {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: `url=${encodeURIComponent(window.location.href.split('#/')[0])}&appid=wxxxxxxxxxxxxx`,
  },
  ticketSuccess: (res) => {
    return res;
  },
});

Vue.prototype.$wechat = wechat;

wechat.on('ready', () => {
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后
  // 如需在页面加载时就调用相关接口，则须把相关接口放在当前函数中调用来确保正确执行。
  // 对于用户触发时才调用的接口，则可以直接调用，不需要放在当前函数中。
  console.log('ready run !');
});
```

### 更新 配置
``` js

// key:
//   imgUrl     分享图
//   link       分享链接
//   title      分享标题
//   desc       分享描述
//   hideMenu   是否隐藏

// this.$wechat.setState(key, value)

this.$wechat.setState('title', '我是更新后的标题')
            .setState('desc', '我是更新后的描述')
            .update();
```

### 分享事件监听
``` js
// shareTimeline   分享到朋友圈
// shareAppMessage 分享给朋友
// shareQQ         分享到QQ
// shareWeibo      分享到微博
// shareQzone      分享到空间

this.$wechat.on('shareTimeline', () => {
  console.log('分享到朋友圈');
});
this.$wechat.on('shareAppMessage', () => {
  console.log('分享到朋友');
});
```

### 动态设置 标题
``` js
this.$wechat.setNativeTitle('标题');
```

### 获取url参数
``` js
const param = this.$wechat.getQueryString('debug')
```

### [vConsole](https://github.com/Tencent/vConsole/blob/dev/README_CN.md) 移动端开发者面板 查看 console 日志
```
地址中添加  debug=true
```
