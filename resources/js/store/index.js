import Vue from "vue";
import Vuex from 'vuex'
import base from './modules/base'
import users from './modules/users'
import auth from "./modules/auth";
import files from "./modules/files"
import requests from "./modules/requests"
import filecategory from "./modules/filecategory";
import createdPersistedState from 'vuex-persistedstate'
import mail from './modules/mail'

Vue.use(Vuex)
export default new Vuex.Store({
    plugins: [
        createdPersistedState({
            storage: window.localStorage,
            paths: [
              'auth',
            ],
          }),
    ],
    modules:{
        users,
        requests,
        auth,
        files,
        filecategory,
        mail,
        base
    }
})
