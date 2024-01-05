import { isDevelopment, isH5, platform } from '@/utils/platform';
import { forward } from '@/utils/router';
import env from '@/config/env';
import { hideLoading, showLoading } from '@/config/serviceLoading';
import { signature } from '@/utils/countersign';
import type { IAccountInfo } from '@/types/store';
const { setToken } = useStore('user');
function reject(err: { errno: number; errmsg: string }) {
  // TO REWRITE: 修改统一的错误信息
  const { errmsg = '抢购火爆，稍候片刻！', errno = -1 } = err;
  switch (errno) {
    case 10000:
      // 特殊异常处理
      forward('login');
      break;

    default:
      uni.showToast({
        title: errmsg
      });
      break;
  }
}

// h5环境开启代理
const apiBaseUrl = isH5 && isDevelopment ? '/api' : env.apiBaseUrl;

interface TruthResult {
  code: number;
  data: any;
  msg: string;
  status: boolean;
}

class HttpRequest {
  requestQueue: any[];
  locked: boolean;
  loginPromise: any;
  resolveQueue: any[];
  constructor() {
    this.requestQueue = [];
    this.locked = false;
    this.loginPromise = null;
    this.resolveQueue = [];
  }

  async baseRequest(
    method:
      | 'OPTIONS'
      | 'GET'
      | 'HEAD'
      | 'POST'
      | 'PUT'
      | 'DELETE'
      | 'TRACE'
      | 'CONNECT'
      | undefined,
    url: string,
    data: { isLoading: any }
  ) {
    this.login();
    const { aSData, encryptionHeader } = this.encryption(url, data, method);
    return new Promise((resolve) => {
      showLoading(data.isLoading);
      delete data.isLoading;
      let responseData: unknown;
      const requestFn = async () => {
        const beseHeaders = {
          authorization: uni.getStorageSync('token'),
          ...encryptionHeader
        };
        uni.request({
          url: apiBaseUrl + url,
          method,
          timeout: 20000,
          header:
            method === 'POST'
              ? {
                  'content-type': 'application/json; charset=utf-8',
                  ...beseHeaders
                }
              : beseHeaders,
          data: aSData,
          dataType: 'json',
          success: (res: any) => {
            // 判断请求状态是否成功
            if (res.statusCode >= 200 && res.statusCode <= 401) {
              const truthResult = res.data as TruthResult;
              // token不存在或已过期
              if (truthResult.code === 401) {
                const fn = () => {
                  return this.baseRequest(method, url, data);
                };
                this.requestQueue.push(fn);
                this.resolveQueue.push(resolve);

                if (!this.loginPromise) {
                  this.locked = true;
                  this.loginPromise = this.silentLogin().finally(() => {
                    this.loginPromise = null;
                    this.locked = false;
                    const queue = this.requestQueue.splice(0);
                    for (let i = 0; i < queue.length; i++) {
                      const fn = queue[i];
                      const privateResolve = this.resolveQueue[i];
                      fn().then((res) => {
                        privateResolve(res);
                      });
                    }
                    this.requestQueue = [];
                  });
                }
              } else if (truthResult.code === 200) {
                responseData = truthResult.data;
                resolve(responseData);
              } else {
                // TO REFACTOR: 业务错误
                reject({
                  errno: truthResult.code,
                  errmsg: truthResult.msg
                });
              }
            } else {
              // TO REFACTOR: 请求错误
              reject({
                errno: -1,
                errmsg: '抢购火爆，稍候片刻！'
              });
            }
          },
          fail: () => {
            reject({
              errno: -1,
              errmsg: '网络不给力，请检查你的网络设置~'
            });
          },
          complete: () => {
            hideLoading();
          }
        });
      };

      if (this.locked) {
        this.requestQueue.push(requestFn);
      } else {
        requestFn();
      }
    });
  }

  encryption(api: string, params: Record<string, any>, method = 'POST') {
    const { data, Signature, Timestamp, Nonce, Version } = signature(
      api,
      method,
      params
    );
    return {
      // 字典排序过后的data
      aSData: data,
      encryptionHeader: {
        Signature,
        Timestamp,
        Nonce,
        Version
      }
    };
  }

  async login() {
    const hasToken = uni.getStorageSync('token');
    if (hasToken) {
      return Promise.resolve();
    }
    await this.privateLogin();

    return this.loginPromise;
  }

  privateLogin() {
    if (!this.loginPromise) {
      this.locked = true;
      this.loginPromise = this.silentLogin().finally(() => {
        this.loginPromise = null;
        this.locked = false;
        this.startQueue();
      });
    }
  }

  silentLogin() {
    const appStore = useStore('app');
    const systemInfo =
      appStore.getSystemInfo() as Ref<UniApp.GetSystemInfoResult>;
    const accountInfo = appStore.getAccountInfo() as Ref<IAccountInfo>;
    return new Promise<void>((resolve) => {
      console.log(11);
      uni.login({
        success: async (res) => {
          const { code } = res;
          uni.request({
            url:
              platform === 'MP-WEIXIN'
                ? `${apiBaseUrl}/user/auth/open_login.json`
                : `${apiBaseUrl}/user/alipay_login.json`,
            method: 'POST',
            data: {
              app_id: accountInfo.value.appId,
              code,
              app_version: accountInfo.value.version,
              platform_version: systemInfo?.value.version,
              device_brand: systemInfo?.value.brand,
              device_model: systemInfo?.value.model,
              device_type: systemInfo?.value.platform,
              device_version: systemInfo?.value.system
            },
            success: (result) => {
              const truthResult = result.data as TruthResult;
              if (truthResult.code === 200) {
                const token = truthResult.data.token;
                setToken(token);
                uni.setStorageSync('token', token);
                resolve();
              } else {
                reject({
                  errno: truthResult.code,
                  errmsg: truthResult.msg
                });
              }
            }
          });
        }
      });
    });
  }

  startQueue() {
    const queue = this.requestQueue.splice(0);
    queue.forEach((fn) => {
      fn();
    });
    this.requestQueue = [];
  }
}

const httpRequest = new HttpRequest();

const http = {
  get: <T>(api: string, params: any) =>
    httpRequest.baseRequest('GET', api, {
      ...params
    }) as Http.Response<T>,
  post: <T>(api: string, params: any) =>
    httpRequest.baseRequest('POST', api, {
      ...params
    }) as Http.Response<T>
};

export default http;
