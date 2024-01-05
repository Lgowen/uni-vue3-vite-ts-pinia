import CryptoJS from 'crypto-js/crypto-js';

const objSort = (arys: Record<string, any>): Record<string, any> => {
  const newkey = Object.keys(arys).sort();
  const newObj = {};
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = arys[newkey[i]];
  }
  return newObj;
};

export const getRandomStr = (): string => {
  return CryptoJS.MD5(
    new Date().getTime() + Math.random().toString(36).slice(-6)
  ).toString();
};

export interface ISignature {
  Signature: string;
  Timestamp: number;
  Nonce: string;
  Version: string;
  data: string | Record<string, any>;
}

/**
 * @param {String} url  不包含参数的接口路径 如 /test/auth.json
 * @param {String} method 请求方式
 * @param {Object} params 参数 GET还是POST都是传对象
 */
export const signature = (
  url: string,
  method = 'POST',
  params = {}
): ISignature => {
  // 字典排序
  let data: Record<string, any> | string = objSort(
    JSON.parse(JSON.stringify(params))
  );
  // 时间戳
  const Timestamp = new Date().getTime();
  // 随机字符串
  const Nonce = getRandomStr();
  // key值 每个项目的key值不同
  const KEY = 'hymiQtQVLDYCUX3v3yemKipGzEkum7B2';
  // 版本号 当前固定v1
  const Version = 'v1';
  // 签名
  let Signature = '';
  if (method === 'POST') {
    data = JSON.stringify(data);
    const stringSign = url + data + Timestamp + Nonce;
    Signature = CryptoJS.HmacSHA256(stringSign, KEY).toString();
  } else if (method === 'GET') {
    const query: string[] = [];
    for (const key in data) {
      query.push(`${key}=${encodeURIComponent(data[key])}`);
    }
    const stringSign = url + query.join('&') + Timestamp + Nonce;
    Signature = CryptoJS.HmacSHA256(stringSign, KEY).toString();
  }
  return {
    Signature,
    Timestamp,
    Nonce,
    Version,
    data
  };
};
