import axios from "axios";

const getDefaultSate = () => {
    return {
        global:{
            status:'',
            message:[],
            showMsg:false,
        },
        isLoading:false
    }
}
const state = getDefaultSate()

const getters =  {

}
const mutations = {
    UPDATE_MESSAGE:(state,value) => {
        state.global.message = value.message
        state.global.status = value.status
        state.global.showMsg = value.show
        state.isLoading = value.isLoading
    },
    UPDATE_LOADING:(state,value) => {
        state.isLoading = value
    }
}
const actions = {

}

export default {
    state,
    actions,
    mutations,
    getters
}