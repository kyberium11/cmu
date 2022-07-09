import axios from "axios";
import router from './../../router'


// STORE STATES
const getDefaultState = () => {
    return {
        users:[],
    }
}
const state = getDefaultState()

/* STORE GETTERS */
const getters = {

    /* FILTER USER STATE BY USER TYPE */
    getUsers(state) {
        return state.users.filter(item => item.user_type === 'Chief' || item.user_type === 'Staff')
    },
    getClients(state) {
        return state.users.filter(item => item.user_type === 'Client')
    },
    totalStaff(state) {
        let total = 0
        let staff = state.users.filter(item => item.user_type === 'Chief' || item.user_type === 'Staff')
        for(const obj of staff) {
            total++
        }
        return total
    },
    totalClients(state) {
        let total = 0;
        let clients = state.users.filter(item => item.user_type === 'Client')
        for(const obj of clients) {
            total++
        }
        return total
    }
}

// STORE MUTATIONS
const mutations = {
    
    //GET USER LIST FROM STORE STATE
    GET_USER_LIST:(state,userList) => {
        state.users = userList
    },

    //ADD USER TO STORE STATE
    ADD_USER:(state,payload) => {   
        state.users.push(payload)
    },

    //UPDATE USER TO STATE
    UPDATE_USER:(state,payload) => {
        const index = state.users.findIndex(item => item.user_id === payload.data.user_id)
        state.users.splice(index,1,payload.data)
    },

    //DELETE USER FROM STORE STATE
    DELETE_USER:(state,user) => {
        const index = state.users.findIndex(item => item.user_id === user.data.user_id)
        state.users.splice(index,1)
    }

}


/* STORE ACTIONS FROM COMPONENTS EVENTS */
const actions = {

    /* FETCH USERS FROM DATABASE */
    async getUserList({commit}) {
        await axios.get('/api/users').then((response) => {
            let userList = response.data.data
            commit('GET_USER_LIST',userList)
        }).catch((err) => {
            console.log(err)
        });
    },


    /* DELETE USERS FROM DATABASE */
    async deleteUser({commit,rootState},user) {
        rootState.base.isLoading = true
        try {
            await axios.delete('/api/users/'+user.user_id).then((response) => {
                commit("DELETE_USER",response.data)
                rootState.base.global = Object.assign({
                    message:[{sucess:"Successfully Deleted"}],
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
        }catch(e) {
            console.log(e)
        }
    },

    /* UPDATE USER FROM DATABASE */
    async updateUser({commit,rootState},payload) {
        rootState.base.isLoading = true
        try {
            await axios.put('/api/users/'+payload.user_id,payload).then((response) => {
                commit("UPDATE_USER",response.data)
                rootState.base.global = Object.assign({
                    message:[{sucess:"Record Successfully Updated"}],
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
        }catch(e) {
            console.log(e)
        }
    },
    async updateCurrentUser({commit,rootState},payload) {
        rootState.base.isLoading = true
        try {
            await axios.put('/api/updatecurrentuser/'+payload.user_id,payload).then((response) => {
                commit("UPDATE_USER",response.data)
                rootState.base.global = Object.assign({
                    message:[{sucess:"Record Successfully Updated"}],
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
        }catch(e) {
            console.log(e)
        }
    },
    /* ADD USER TO DATABASE */
    addUser({commit,rootState},payload) {
        rootState.base.isLoading = true
        try {
            axios.post('/api/register',payload).then((response) => {
                if(response.status === 201) {
                    commit('ADD_USER',response.data)
                    rootState.base.global = Object.assign({
                        message:[{sucess:"Record Successfully Added"}],
                        status: "Success",
                        showMsg:true
                    })
                }else {
                    rootState.base.global = {
                        message:err.response.data,
                        status: "Error",
                        showMsg:true
                    }
                }
            }).catch((err) => {
                rootState.base.global = {
                    message:err.response.data,
                    status: "Error",
                    showMsg:true
                }
            }).finally(function(){
                    rootState.base.isLoading = false
            });
        }catch(e) {
            console.log(e)
        }
        
    },
}
export default {
    state,
    actions,
    mutations,
    getters
}
