<template>
  <ul class="box">
    <li>0</li>
    <li>1</li>
    <li>2</li>
    <li><router-link to="/">返回首页</router-link></li>
  </ul>
</template>

<script>
export default {
  name: 'list',
  created() {
    this.$wechat.setState('title', '更新分享标题').update();
    this.$wechat.setNativeTitle('这是一个新的标题');
    this.$wechat.on('shareTimeline', () => {
      console.log('list 分享到朋友圈!');
    });
    this.$wechat.on('shareAppMessage', () => {
      console.log('list 分享到朋友!');
    });
    this.$wechat.on('error', (error) => {
      console.log(error);
    });
  },
};
</script>

<style>
</style>
