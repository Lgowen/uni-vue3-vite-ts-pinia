<script lang="ts" setup>
import { fetchHomePage } from '@/api/firstPage';
const visible = ref(true);

onLoad(() => {
  console.log('页面初始化了');
  getPageData();
  uniAsyncTest();
});

async function getPageData() {
  try {
    console.log(fetchHomePage, ' fetchHomePagefetchHomePage');
    const res = await fetchHomePage({});
    console.log(res, 'ressss');
  } catch (err) {
    console.log(err, 'errrrrr');
  }
}

const { getSystemInfo } = useStore('app');

async function uniAsyncTest() {
  const systemInfo = getSystemInfo();
  console.log(systemInfo.value, 'appStore.getSystemInfo');
}

function handleClickPageModal() {
  console.log('点击了PageModal');
}

function handleClose() {
  console.log('点击了关闭按钮');
}
</script>

<template>
  <div class="h-screen">
    <pageModal
      v-model:visible="visible"
      @click="handleClickPageModal"
      @close="handleClose"
    />
    <backToTop />
  </div>
  <!-- <defaultPage safe-area image-type="address" text="测试一下文案是否成功" /> -->
</template>

<style lang="scss" scoped></style>
