import { createRouter,createWebHashHistory } from "vue-router";

import CesiumCommunication from '../pages/CesiumCommunication.vue'
import Home from '../pages/Home'


const router = createRouter({
	history:createWebHashHistory(),
	routes: [
		{
			path: '/home',
			component: Home,
			meta: {
				footerShow: true
			}
		},
		{
			name:'cesiumCommunication',
			path:'/cesiumCommunication',
			component:CesiumCommunication,

		},
		// 重定向
		{
			path: "/:catchAll(.*)",
			redirect: '/Home',
			meta: {
				footerShow: false
			}

		}
	]
})

export default router
