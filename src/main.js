import Vue from 'vue'
import router from './router'
import _ from 'lodash';
import AppCanvas from './pages/AppCanvas'
import ElementUI from 'element-ui';
import './assets/style/index.less';
import 'element-ui/lib/theme-chalk/index.css';
import {post, fetch, patch, put} from './utils/http'
import {api} from './utils/api'

Vue.use(ElementUI);
Vue.prototype._ = _;


//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$api = api;


Vue.config.productionTip = false;

window.$vm = new Vue({
  el: '#app',
  render: h => h(AppCanvas),
  router,
});
