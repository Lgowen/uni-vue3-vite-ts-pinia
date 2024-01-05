<script setup lang="ts">
defineProps({
  mainImg: {
    type: String,
    default: 'https://bank-admin.cdn.houselai.cn/v2/20231027-653b8cf8c1c4c.webp'
  },
  closeImg: {
    type: String,
    default:
      'https://env-00jx4160lavv.normal.cloudstatic.cn/flower-mall/20230619-64900654a44aa.webp'
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:visible', 'click', 'close']);

function handleClose() {
  emits('update:visible', false);
  emits('close');
}
</script>

<template>
  <view v-if="visible">
    <overlay :overlay-appear="visible" :opacity="0.75" />
    <view class="page_modal flex items-center justify-center">
      <view class="page_modal_container" @click="emits('click')">
        <image
          class="page_modal_container--image"
          mode="scaleToFill"
          :src="mainImg"
          show-menu-by-longpress
        ></image>
      </view>
      <view class="page_modal_close" @click="handleClose">
        <image
          class="page_modal_close--image"
          mode="scaleToFill"
          :src="closeImg"
        ></image>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page_modal {
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);

  &_container {
    width: 630rpx;
    height: 1020rpx;
  }

  &_close {
    margin-top: 75rpx;
    width: 58rpx;
    height: 58rpx;
  }

  &_container--image,
  &_close--image {
    width: 100%;
    height: 100%;
  }
}
</style>
