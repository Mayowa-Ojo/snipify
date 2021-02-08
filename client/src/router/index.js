import Vue from "vue"
import VueRouter from "vue-router"

import Landing from "../views/Landing"
import Home from "../views/Home"

Vue.use(VueRouter)

const APP_NAME = process.env.VUE_APP_TITLE

const routes = [
   {
      path: '/',
      name: 'Landing',
      component: Landing,
      meta: {
         title: `${APP_NAME} - Welcome!`
      }
   },
   {
      path: '/snips',
      name: 'Home',
      component: Home,
      meta: {
         title: `${APP_NAME} - Discover`
      }
   },
]

const router = new VueRouter({
   mode: 'history',
   base: '/',
   routes
})

router.beforeEach((to, _from, next) => {
   const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

   if(nearestWithTitle) {
      document.title = nearestWithTitle.meta.title
   }

   next()
})

export default router