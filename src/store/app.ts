import type { IAccountInfo } from '../types/store';

export default defineStore('app', () => {
  const systemInfo = ref<UniApp.GetSystemInfoResult | null>(null);
  const accountInfo = ref<IAccountInfo | null>(null);

  function getSystemInfo() {
    if (systemInfo.value) return systemInfo;
    const newSystemInfo = uni.getSystemInfoSync();
    setSystemInfo(newSystemInfo);
    return systemInfo;
  }

  function setSystemInfo(value: UniApp.GetSystemInfoResult) {
    systemInfo.value = value;
  }

  function getAccountInfo() {
    if (accountInfo.value) return accountInfo;
    const {
      miniProgram: { appId, version }
    } = uni.getAccountInfoSync();
    const newAccountInfo = { appId, version };
    setAccountInfo(newAccountInfo);
    return accountInfo;
  }

  function setAccountInfo(value: IAccountInfo) {
    accountInfo.value = value;
  }

  return {
    accountInfo,
    getAccountInfo,
    setAccountInfo,
    systemInfo,
    getSystemInfo,
    setSystemInfo
  };
});
