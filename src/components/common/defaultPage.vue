<script setup lang="ts">
defineProps({
  safeArea: {
    type: Boolean,
    default: false
  },
  imageType: {
    type: String
  },
  text: {
    type: String
  }
});
</script>

<template>
  <view
    class="default_page flex items-center justify-center"
    :class="{ 'default_page--safe_area': safeArea }"
  >
    <view class="flex flex-col items-center justify-center">
      <view
        class="default_page--background bg-contain bg-no-repeat"
        :class="`default_page--background--${imageType}`"
      />
      <view class="default_page--text fs-28">{{ text }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.default_page {
  height: 100%;
  min-height: 100vh;

  &--safe_area {
    min-height: calc(100vh - 130rpx - constant(safe-area-inset-bottom));
    min-height: calc(100vh - 130rpx - env(safe-area-inset-bottom));
  }

  &--background {
    width: 344rpx;
    height: 268rpx;

    &--address {
      background-image: url('https://env-00jx4160lavv.normal.cloudstatic.cn/flower-mall/20230720-64b89659980b1.webp');
    }

    &--order {
      background-image: url('https://env-00jx4160lavv.normal.cloudstatic.cn/flower-mall/20230720-64b896904a94e.webp');
    }
  }
}
</style>
