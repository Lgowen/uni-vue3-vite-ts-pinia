import http from '@/service/request';

// 首页推荐商品列表
export function fetchGoodHomeList(data) {
  return http.post('/goods/index_list.json', data);
}

// 首页数据
export function fetchHomePage(data) {
  return http.post('/index/page.json', data);
}

// 服务直达
export function fetchServer(data) {
  return http.post('/child_server/index.json', data);
}

// 关注生活号活动配置
export function fetchLifeConfig(data) {
  return http.post('/life_follow_config.json', data);
}

// 获取关注生活号数据
export function fetchLifeCoupon(data) {
  return http.post('/user/save_life_follow.json', data);
}

// 获取子服务加载/分类数据
export function fetchChildServerData(data) {
  return http.post('/child_server/data.json', data);
}
