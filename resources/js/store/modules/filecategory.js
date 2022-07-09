import axios from "axios";


/* STORE STATES */
const getDefaultSate = () => {
    return {
        filecategory: [],
    }
}

/* DEFAULT STORE STATES */
const state = getDefaultSate()


/* STORE GETTERS */
const getters = {
    getCategory(state) {
        return state.filecategory.filter(item => item.category_id != 0)
    }

}

/* STORE MUTATIONS */
const mutations = {
    GET_FILE_CATEGORY: (state,filecategory) => {
        state.filecategory = filecategory
    },

    ADD_FILE_CATEGORY:(state,filecategory) => {
        state.filecategory.push(filecategory)
    },

    UPDATE_FILE_CATEGORY:(state,filecategory) => {
        const index = state.filecategory.findIndex(item => item.category_id === filecategory.category_id)
        state.filecategory.splice(index,1,filecategory)
    },

    DELETE_FILE_CATEGORY:(state,filecategory) => {
        const index = state.filecategory.findIndex(item => item.category_id === filecategory.category_id)
        state.filecategory.splice(index,1)
    }

}

/* STORE ACTIONS */
const actions = {

    /* FETCH REQUESTS DATA FROM DATABASE */
    async getFileCategory({ commit }) {
        try {
            await axios.get('/api/filecategory').then((response) => {
                let data = response.data.data
                commit('GET_FILE_CATEGORY', data)

            }).catch((err) => {
                console.log(err.response.data)

            });

        } catch (error) {
            console.error();
        }

    },

    async addCategory({commit,rootState},data) {
        rootState.base.isLoading = true
        try {
            await axios.post('/api/filecategory',data).then((response) => {
                commit("ADD_FILE_CATEGORY",response.data)

                //Notification
                rootState.base.global = Object.assign({
                    message: [{ success: "Category successfully added" }],
                    status: 'Success',
                    showMsg: true,
                })

            }).catch((err) => {
                console.log(err.response.data)

                 //Notification
                 rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })

            }).finally(function() {
                rootState.base.isLoading = false
            });
        } catch (error) {
            console.error();
        }
    },


    async updateCategory({commit,rootState},data) {
        rootState.base.isLoading = true
        try {
           await axios.put('/api/filecategory/'+data.category_id,data).then((response) => {
                commit("UPDATE_FILE_CATEGORY",response.data)
                //Notification
                rootState.base.global = Object.assign({
                    message: [{ success: "Category successfully updated" }],
                    status: 'Success',
                    showMsg: true,
                })

           }).catch((err) => {
               console.log(err.response.data)

                 //Notification
                 rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })

           }).finally(function(){
               rootState.base.isLoading = false
           })
        } catch (error) {
            console.error();
        }
    },

    async deleteCategory({commit,rootState},data) {
        rootState.base.isLoading = true
        try {
            await axios.delete('/api/filecategory/'+data.category_id,data).then((response) => {
                commit("DELETE_FILE_CATEGORY",response.data)

                 //Notification
                 rootState.base.global = Object.assign({
                    message: [{ success: "Category successfully updated" }],
                    status: 'Success',
                    showMsg: true,
                })
            }).catch((err) => {
                console.log(err.response.data)

                
                 //Notification
                 rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })

            }).finally(function(){
                rootState.base.isLoading = false
            })
        } catch (error) {
            console.error();
        }
    }




}

export default {
    state,
    getters,
    mutations,
    actions
}
