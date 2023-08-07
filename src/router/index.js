import { createRouter, createWebHistory } from 'vue-router'
import { checkJwt } from '../utils/jwtHelper'
import { useAuthStore } from '../stores/authStore'

const HomePage = () => import("../views/HomePage.vue")
const ProfilePage = () => import("../views/ProfilePage.vue")
const NotFoundPage = () => import("../views/NotFoundPage.vue")


const routes = [
  { path: '/', name: "Home", component: HomePage },
  { path: '/profile/:username', name: "Profile", component: ProfilePage },
  { path: '/:pathMatch(.*)*', name: "NotFound", component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const { changeAuthenticationStatus } = useAuthStore()
  if (checkJwt()) {
    changeAuthenticationStatus(true)
  }
  else {
    changeAuthenticationStatus(false)
  }
  return true;
})


export default router
