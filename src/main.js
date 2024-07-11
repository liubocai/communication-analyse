import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/css/index.css'

import store from './store'

import router from './router'
import userinfo from './userinfo/userinfo'
import tool from "./userinfo/tool";

import VueCookies from 'vue-cookies'
import { setCookie, getCookie, checkCookie, clearCookie } from '@/userinfo/cookies';
import VueParticles from 'vue-particles'

import animated from 'animate.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'





import widgets from "cesium/Widgets/widgets.css";

// Vue.config.productionTip = false

// Vue.prototype.$setCookie = setCookie;
// Vue.prototype.$getCookie = getCookie;
// Vue.prototype.$checkCookie = checkCookie;
// Vue.prototype.$clearCookie = clearCookie;
// Vue.prototype.$userinfo = userinfo;

// Vue.prototype.widgets = widgets;


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(VueCookies)
app.use(animated)

app.use(VueParticles)  
// app.use(tool);

app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')