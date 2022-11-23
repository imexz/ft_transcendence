import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import ProfileView from '@/views/ProfileView.vue';
import ApiTestView from '@/views/ApiTestView.vue';
import LoginView from '@/views/LoginView.vue';
import SettingsView from '@/views/SettingsView.vue';
import PlayView from '@/views/ProfileView.vue';
import ScoreboardView from '@/views/Scoreboard.vue';
import ChatView from '@/views/Chats.vue';


import store from '../store/index'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'me',
    props: {id : "0"},
    // component: () => import('../views/ProfileView.vue')
    component: ProfileView
  },
  {
    path: '/api_test',
    name: 'api_test',
    component: ApiTestView
  },
  {
    path: '/login',
    name: 'login',
    props: {tfa : false},
    component: LoginView
  },
  {
    path: '/login/tfa',
    name: 'tfa',
    props: {tfa : true},
    component: LoginView
  },
  {
    path: '/profile/:id',
    name: 'profile',
    props: true,
    component: ProfileView
  },
  {
    path: '/settings',
    name: 'settings',
    // component: () => import('../views/SettingsView.vue')
    component: SettingsView
  },
  {
    path: '/play',
    name: 'play',
    component: PlayView
  },
  {
    path: '/scoreboard',
    name: 'scoreboard',
    component: ScoreboardView
  },
  {
    path: '/chat',
    name: 'Chats',
    component: ChatView
  }    
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/login/tfa'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && store.state.user == null) {
    await store.dispatch('validateUser')
    if (store.state.user == null)
      return '/login';
  }
})

export default router
