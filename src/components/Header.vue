<template>
	<!-- <div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" background-color="#000" mode="horizontal"
			:ellipsis="false" @select="handleSelect" text-color="#fff">
			<router-link class="list-group-item" active-class="active" to="/Home">
					<h2 class="project-name" style="font-size:25px;color: #FFF;">灾害应急辅助平台</h2>
				</router-link>
			<el-menu-item style="margin-left: 68%;" index="1" @click.native="toHome()">首页</el-menu-item>
			<el-sub-menu index="5" v-if="getislogin">
				<template #title>我的</template>
				<el-menu-item index="5-1" @click.native="toPerson()">
					个人中心
				</el-menu-item>
				<el-menu-item index="5-2" @click.native="toProject()">
					我的项目
				</el-menu-item>
				<el-menu-item index="5-3" @click.native="exitLogin()" v-if="getislogin">
					退出登录
				</el-menu-item>


			</el-sub-menu>
			<el-menu-item index="2" @click.native="toLogin()" v-if="!getislogin">登录</el-menu-item>
			<el-sub-menu index="3">
				<template #title>工作区</template>
				<el-menu-item index="3-1" @click.native="toCesium()">应急协作</el-menu-item>
				<el-menu-item index="3-2" @click.native="toCommuication()">应急通信</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</div> -->
	<div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" background-color="#000" mode="horizontal"
			:ellipsis="false" @select="handleSelect" text-color="#fff">
			<router-link class="list-group-item" active-class="active" to="/Home">
					<h2 class="project-name" style="font-size:25px;color: #FFF;">通信态势分析平台</h2>
				</router-link>
			<el-menu-item index="3-2" style="margin-left: 5%;" @click.native="toCommuication()">通信态势感知</el-menu-item>
			<!-- <el-menu-item style="margin-left: 68%;" index="1" @click.native="toHome()">首页</el-menu-item>
			<el-sub-menu index="5" v-if="getislogin">
				<template #title>我的</template>
				<el-menu-item index="5-1" @click.native="toPerson()">
					个人中心
				</el-menu-item>
				<el-menu-item index="5-2" @click.native="toProject()">
					我的项目
				</el-menu-item>
				<el-menu-item index="5-3" @click.native="exitLogin()" v-if="getislogin">
					退出登录
				</el-menu-item>


			</el-sub-menu>
			<el-menu-item index="2" @click.native="toLogin()" v-if="!getislogin">登录</el-menu-item>
			<el-sub-menu index="3">
				<template #title>工作区</template>
				<el-menu-item index="3-1" @click.native="toCesium()">应急协作</el-menu-item>
				
			</el-sub-menu> -->
		</el-menu>
	</div>
</template>

<script>
export default {
	name: "Header",
	data() {
		return {

			activeIndex: "1",
			islogin: false,

		};
	},
	computed: {
		getislogin(){

			return this.$store.state.isLogin||this.islogin

		}
	},
	methods: {

		created: function () {

		},

		toRegister() {
			this.$router.push("/register");
		},
		toLogin() {
			this.$router.push("/login");
		},
		toWork() {
			this.$router.push("/work");
		},
		toCesium() {
			this.$router.push("/cesiumContainer");
		},
		toCommuication() {
			this.$router.push("/cesiumCommunication");
		},
		toProject() {
			this.$router.push("/project");
		},
		exitLogin() {
			// 清空token
			// window.localStorage.removeItem('token')
			window.localStorage.clear();
			//   跳转到登录页
			this.islogin = false
			this.getislogin = false
			this.$router.push("/home");
			this.$store.state.isLogin=false
			setTimeout(() => { //此处必须使用vue函数，否则this无法访vue实例
				this.$message(`退出成功！`)
			}, 200);
		},
		toPerson() {
			this.$router.push("/personal");
		},
		toHome() {
			this.$router.push("/home");
		},

	},
	created() {
		this.islogin = localStorage.getItem('isLogin')
	},
	mounted() {


	}



};
</script>

<style scoped>
.el-menu {
	padding-left: 23px;
	background-color: #19284b !important;
}

.logo {
	width: 60px;
	height: 60px;

	float: left;
	left: 6%;
	top: 8px;
}

.first-menu {
	float: right;
	height: 60px;
}

/* .el-menu--horizontal > .el-menu-item {
  float: right;
} */
.el-menu-item:hover {
	background-color: rgb(64, 64, 64) !important;
	;
}

.el-menu-item.is-active {
	background-color: rgb(0, 0, 0) !important;
	;

	.flex-grow {
		flex-grow: 1;
	}
}

.project-name {
	width: auto;
	height: 5px;
	position: relative;
	float: left;
	color: aliceblue;
	margin-top: 10px;
	margin-left: 5px;
	top: 3px;
	left: 10px;
}
</style>

