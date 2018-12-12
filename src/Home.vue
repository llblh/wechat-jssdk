<template>
  <div class="main">
    <div class="main-box">
      <router-link to="/list">点我点我</router-link>
      <br>
    </div>
    <br>
    <div class="box">
      <p>如果项目使用了vue-router里面的history模式,这种模式下的url是不断变化的,<br/>
      而jssdk在每一次url变化的时候都需要重新config,导致每跳转一个页面都需要重新去进行config</p>
      <p>而使用vue-router的默认模式,只是hash部分(#后面的内容)变化,这种变化是不需要重新进行config的</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
    };
  },
  created() {
    this.$wechat.on('shareTimeline', () => {
      console.log('分享到朋友圈!');
    });
    this.$wechat.on('shareAppMessage', () => {
      console.log('分享到朋友!');
    });
    this.$wechat.on('error', (error) => {
      console.log(error);
    });
    this.$wechat.setNativeTitle('这是我新设置的title!');
    const param = this.$wechat.getQueryString('debug');
    console.log('param: ', param);
  },
  methods: {
  },
};
</script>

<style>
.main-box {
  padding: 15px;
}
</style>
