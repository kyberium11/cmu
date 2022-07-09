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
    GET_EMAIL:(state) => {

    },
    /* ADD FILE DATA FROM STORE STATES */
    ADD_EMAIL:(state) => {
        
    }
}

/* STORE ACTIONS */
const actions = {
    
    /* FETCH FILE DATA FROM DATABASE */
    async getEmails({commit}) {

    },
    
    /* ADD FILE TO DATABASE */
    async sendEmail({commit,rootState},payload) {
        rootState.base.isLoading = true
        try {
            axios.post('/api/mail',payload).then((response) => {
                console.log(response.data)
                    rootState.base.global = Object.assign({
                        message:[{sucess:"Message Successfully Sent"}],
                        status: "Success",
                        showMsg:true
                    })
            }).catch((err) => {
                rootState.base.global = {
                    message:err.response.data,
                    status: "Error",
                    showMsg:true
                }
            }).finally(function(){
                    rootState.base.isLoading = false
            });
        }catch(error) {
            console.log(error)
        }
    }

}

export default {
    state,
    getters,
    mutations,
    actions
}
