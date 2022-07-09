// src/plugins/vuetify.js
//import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
          light: {
            primary:'#1E88E5',
            warning: '#FF9800',
            info: '#1E88E5',
            error: '#EF5350',
            success: '#388E3C'
          },
        },
    },
    options: {
        customProperties: true
    }
})
