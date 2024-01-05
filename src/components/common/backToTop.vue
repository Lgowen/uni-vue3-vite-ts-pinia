<script setup lang="ts">
function backToTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300 // 支付宝小程序不填该值动画不生效
  });
}
</script>

<template>
  <view
    class="back_to_top flex flex-col items-center justify-center"
    @click="backToTop"
  >
    <text>顶部</text>
  </view>
</template>

<style scoped lang="scss">
.back_to_top {
  width: 82rpx;
  height: 82rpx;
  position: fixed;
  bottom: calc(206rpx + constant(safe-area-inset-bottom));
  bottom: calc(206rpx + env(safe-area-inset-bottom));
  right: 44rpx;
  /* color: #000; */
  font-size: 18rpx;
  border-radius: 50rpx;
  background-color: #fff;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));

  &::before {
    content: '';
    display: block;
    width: 42rpx;
    height: 42rpx;
    background-image: url('@/static/images/lineup.png');
    background-size: contain;
    background-repeat: no-repeat;
  }

  & text {
    color: #1e1e1e;
    opacity: 0.7;
  }
}
</style>
