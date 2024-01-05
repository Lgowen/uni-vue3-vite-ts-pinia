const apiEnv: ApiEnv = 'dev';
const envMap = {
  dev: {
    baseUrl: 'https://api-flm.llnovel.com',
    apiBaseUrl: 'https://api-flm.llnovel.com'
  },
  beta: {
    baseUrl: 'http://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com'
  },
  prod: {
    baseUrl: 'https://api-flm.errli.cn',
    apiBaseUrl: 'https://api-flm.errli.cn'
  },
  local: {
    baseUrl: 'http://m.dev.xxx.com',
    apiBaseUrl: 'https://m.devapi.xxx.com'
  }
};

type ApiEnv = keyof typeof envMap;
type Env<T extends ApiEnv> = {
  apiEnv: T;
} & (typeof envMap)[T];

function createEnv(apiEnv: ApiEnv): Env<typeof apiEnv> {
  return Object.assign({ apiEnv }, envMap[apiEnv]);
}

const env = createEnv(apiEnv);
export default env;
