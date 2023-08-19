import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import Vuetify from 'vuetify'
import '@/components/UI/UI.js'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import VueTheMask from 'vue-the-mask'
import "vue-select/dist/vue-select.css";
import '@/helpers/VeeValidate.js'
import i18n from  '@/i18n.js'
import { vMaska } from 'maska';

import 'moment/locale/en-gb.js'
import 'moment/locale/ru.js'

import moment from 'moment';

Vue.directive('maska', vMaska);


Vue.use(DatePicker, {
  componentPrefix: 'vc',
});
Vue.component('vc-date-picker', DatePicker)

Vue.use(Vuetify)
Vue.use(VueTheMask)
Vue.config.productionTip = false
Vue.prototype.moment = moment

Vue.use(moment)
Vue.prototype.$moment = moment

new Vue({
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#3f51b5',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',

        },
        dark: {
        },
      },
    }}),
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
