/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import Vue from 'vue';
import Router from 'vue-router';
import WechatJSSDK from './lib/index';
import App from './App.vue';
import Home from './Home.vue';
import List from './List.vue';


Vue.config.productionTip = false;

const wechat = new WechatJSSDK({
  ticketUrl: 'http://xxx.com/api/get_jsticket',
  ticketConfig: {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: `url=${encodeURIComponent(window.location.href.split('#/')[0])}&appid=wxxxxxxxxxxxxx`,
  },
  ticketSuccess: (res) => {
    if (typeof res === 'object' && !res.err_code) {
      return res.data;
    }
    return res;
  },
  appId: 'wxxxxxxxxxxxxx',
  imgUrl: 'http://stor.xxx.xxx',
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
