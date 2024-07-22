import { createStore } from 'vuex'


export default createStore({
	state: {
		serverurl:"http://127.0.0.1:8092",
		dataServerUrl: "http://127.0.0.1:8082",
		upLoadProgress:0,
		imgLoading:false,
		isLogin:false
	},
	mutations: {
	},
	actions: {
	},
	modules: {
	}
  })