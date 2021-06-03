/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import Vue from 'vue';
import Router from 'vue-router';
import WechatJSSDK from './lib/index';
import App from './App.vue';
import Home from './Home.vue';
import List from './List.vue';


Vue.config.productionTip = false;

const wechat = new WechatJSSDK({
  ticketUrl: 'https://wxb1da4e0fd6ad1262.mp.weixinhost.com/addon/weixin_web_dev_tools?a=get_jsticket',
  ticketConfig: {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: `url=${encodeURIComponent(window.location.href.split('#/')[0])}&appid=wxb1da4e0fd6ad1262`,
  },
  ticketSuccess: (res) => {
    if (typeof res === 'object' && !res.err_code) {
      return res.data;
    }
    return res;
  },
  appId: 'wxb1da4e0fd6ad1262',
  imgUrl: 'http://stor.weixinhost.com/3/wxhost-images/rf_38d41d9e9bf1fda4e8dc02723beea184',
  link: '',
  title: '我是分享标题',
  desc: '我是分享描述',
  hideMenu: false,
  debug: false,
});

Vue.prototype.$wechat = wechat;

Vue.use(Router);
const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
  ],
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
