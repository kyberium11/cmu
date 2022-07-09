/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap')
window.Vue = require('vue').default;
import Vue from 'vue'


import router from './router'

/** ANIMATE ON SCROLL */
import AOS from 'aos'
import 'aos/dist/aos.css'

import VueLodash from 'vue-lodash'
import lodash from 'lodash'
 
// name is optional
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })


import VueCharts from 'vue-chartjs'
import 'chart.js'
Vue.use(VueCharts)

import FlashMessage from '@smartweb/vue-flash-message';
Vue.use(FlashMessage);

/** ANIMATE CSS */
import 'animate.css'


/* VUEX STORE */
import store from './store/index'


/**DATA TABLES */
import vuetify from '../plugins/vuetify'



/** SCROLL SPY */
import scrollSpy, { Easing } from 'vue2-scrollspy';

Vue.use(scrollSpy, {
  easing: Easing.Cubic.In
});



// register jw pagination component globally
import JwPagination from 'jw-vue-pagination';
Vue.component('jw-pagination', JwPagination);


//VUETIFY DATE TIME PICKER
import DatetimePicker from 'vuetify-datetime-picker'
// (Optional) import 'vuetify-datetime-picker/src/stylus/main.styl'
Vue.use(DatetimePicker)



/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('app-component', require('./components/App.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
const app = new Vue({
    el: '#app',
    vuetify,
    store,
    router,
    mounted() {
        AOS.init({
            duration: 1200,
        })
    },
}).$mount('#app');
