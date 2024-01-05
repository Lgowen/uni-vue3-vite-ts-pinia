export default defineStore('user', () => {
  const token = ref<string>(uni.getStorageSync('token'));
  function setToken(newToken: string) {
    token.value = newToken;
  }

  return { token, setToken };
});
