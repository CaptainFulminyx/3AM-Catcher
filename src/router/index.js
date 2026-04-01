// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
   // {
  //    path: '/',
 //     name: 'home',
  //    component: () => import('@/views/HomeView.vue'),
 //     meta: { requiresAuth: true }
 //   },
    {
      path: '/',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { requiresAuth: false }
    },
//    {
 //     path: '/feed',
//      name: 'feed',
//      component: () => import('@/views/FeedView.vue'),
//      meta: { requiresAuth: true }
//    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  } 
  else if (to.path === '/auth' && isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router