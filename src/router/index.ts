import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ProfilesView from '../views/ProfilesView.vue'
import SignInComponent from '../components/profile/SignInComponent.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/profiles',
    name: 'profiles',
    component: ProfilesView
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: ProfilesView
  },
  {
    path: '/signin',
    name: 'signIn',
    component: SignInComponent
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
