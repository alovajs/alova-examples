import { createRouter, createWebHashHistory } from "vue-router";

/** @type {import('vue-router').RouteRecordRaw} */
const routes = [
  {
		path: '/',
		name: 'home',
		component: () => import('./views/home/Main.vue')
	},
  {
		path: '/detail',
		name: 'detail',
		component: () => import('./views/detail/Detail.vue')
	},
]

export default createRouter({
	history: createWebHashHistory(),
	routes
});