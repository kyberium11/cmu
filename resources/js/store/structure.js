import axios from "axios";


/* STORE STATES */
const getDefaultSate = () => {
    return {

    }
}

/* DEFAULT STORE STATES */
const state = getDefaultSate()


/* STORE GETTERS */
const getters = {

}

/* STORE MUTATIONS */
const mutations = {
    /* FETCH FILE DATA FROM STORE STATES */
    GET_FILES:(state) => {

    },


    /* UPDATE FILE DATA FROM STORE STATES */
    UPDATE_FILE:(state) => {
        
    },


    /* DELETE FILE DATA FROM STORE STATES */
    DELETE_FILE:(state) => {
        
    },


    /* ADD FILE DATA FROM STORE STATES */
    ADD_FILE:(state) => {
        
    }
}

/* STORE ACTIONS */
const actions = {
    
    /* FETCH FILE DATA FROM DATABASE */
    async getFiles({commit}) {

    },



    /* UPDATE FILE DATA FROM DATABASE */
    async updateFile({commit}) {

    },




    /* DELETE FILE DATA FROM DATABASE */
    async deleteFile({commit}) {
        
    },

    
    
    /* ADD FILE TO DATABASE */
    async addFile({commit}) {

    }

}

export default {
    state,
    getters,
    mutations,
    actions
}
