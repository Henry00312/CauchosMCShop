import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/vistas/HomeView.vue'
import Success from '@/views/vistas/Success.vue'
import Pending from '@/views/vistas/Pending.vue'
import Failure from '@/views/vistas/Failure.vue'
import Contact from '@/views/vistas/Contact.vue'
import Manage from '@/views/vistas/Manage.vue'
import LogIn from '@/views/vistas/LogIn.vue'
import store from '@/store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/success',
    name: 'Success',
    component: Success
  },
  {
    path: '/pending',
    name: 'Pending',
    component: Pending
  },
  {
    path: '/failure',
    name: 'Failure',
    component: Failure
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage,
    meta: {rutaProtegida: true}
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const pathProtect = to.matched.some(item => item.meta.rutaProtegida)
  const token = localStorage.getItem('token');
  const tokenExp = localStorage.getItem('tokenExp');

  const isExpired = !tokenExp || Date.now() > parseInt(tokenExp);

  if (isExpired) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExp');
  }

  if (pathProtect && (!token || isExpired)) {
    next('/login');
  } else {
    next();
  }

})

export default router
