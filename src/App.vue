<template>
	<div id="app">

		<Header></Header>
		<router-view></router-view>
		<!-- <Login /> -->
	</div>
</template>

<script>
	import Home from "./pages/Home";

	import Header from "./components/Header";
	export default {
		name: 'App',
		components: {
			Home,
			Header,
			
		},
		data() {
			return {
			}
		},

		methods: {

		},

		created() {

		}
	};
</script>

<style>
	/* 用于控制抽屉的css，因为写在组件里没用，所以目前直接写在APP里，后续需要改进 */
	#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
