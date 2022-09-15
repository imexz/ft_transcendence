import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/api_test',
    name: 'api_test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ApiTestView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  // {
  //   path: '/profile/:id',

  //   redirect: to => {
  //     return { path: '/profile', props: true }
  //   },
  //   // props: {id : 1},
    
  // },
  {
    path: '/profile/:id',
    name: 'profile',
    props: true,
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('../views/PlayView.vue')
  }  
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from) => {
  if (to.name != 'login' && !store.getters.isValidated) {
    return { name: 'login' };
  }
})

export default router
