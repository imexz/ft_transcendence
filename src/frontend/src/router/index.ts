import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


import store from '../store/index'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'me',
    props: {id : "0"},
    component: () => import('../views/ProfileView.vue')
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
    props: {tfa : false},
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/login/tfa',
    name: 'tfa',
    props: {tfa : true},
    component: () => import('../views/LoginView.vue')
  },
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
  },
  {
    path: '/play/:id',
    name: 'playSpetate',
    props: true,
    component: () => import('../views/PlayView.vue')
  },
  {
    path: '/chat',
    name: 'Chats',
    component: () => import('../views/Chats.vue')
  }    
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/login/tfa'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !store.getters.isLogged) {
    return '/login';
  }
})

export default router
