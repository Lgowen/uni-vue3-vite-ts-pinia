<script setup lang="ts">
defineProps({
  overlayAppear: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 999
  },
  opacity: {
    type: Number,
    default: 0.3
  }
});

const emits = defineEmits(['close']);

function handleClose() {
  emits('close');
}
</script>

<template>
  <view
    v-show="overlayAppear"
    class="overlay"
    :class="{ show: overlayAppear }"
    :style="{ zIndex, opacity }"
    @click.stop="handleClose"
  ></view>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0);
  transition: background-color 0.3s ease-in-out;
}

.overlay.show {
  opacity: 1;
}
</style>
