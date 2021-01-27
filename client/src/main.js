import Vue from 'vue'
import VueTippy from "vue-tippy";

import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/app.scss"
import { VueSvgIcon } from '@yzfe/vue-svgicon'
import '@yzfe/svgicon/lib/svgicon.css'

Vue.config.productionTip = false

Vue.use(VueTippy)

Vue.component('icon', VueSvgIcon)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
