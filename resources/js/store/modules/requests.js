import axios from "axios";


/* STORE STATES */
const getDefaultSate = () => {
    return {
        requests: [],
        request_form: null,
        request_document: null,
        request_report: [],
        request_report_weekly: [],
        request_report_monthly: [],
        request_report_yearly: [],
        file_request_reports:[],
    }
}

/* DEFAULT STORE STATES */
const state = getDefaultSate()


/* STORE GETTERS */
const getters = {
    getRequests(state) {
        return state.requests.filter(item => item.status === 'Pending')
    },
    getApprovedPendingRequest: (state) => (user_id) => {
        const req = state.requests.filter(item => item.user_id === user_id)
        /* return state.requests.filter(item => item.status === 'Approved' || item.status ==='Pending' && item.user_id === user_id) */
        return req.filter(item => item.status === 'Approved' || item.status === 'Pending')

    },

    getRequestsLog: (state) => (user_id) => {
        const req = state.requests.filter(item => item.user_id === user_id)
        return req.filter(item => item.status === 'Approved' || item.status === 'Expired' || item.status === 'Denied')
    },


    getRequestsLogStaff(state) {
        return state.requests.filter(item => item.status === 'Approved' || item.status === 'Expired' || item.status === 'Denied')
    },




    totalPendingApprovedRequest(state) {
        let total = 0
        let requests = state.requests.filter(item => item.status === 'Pending')
        for (const obj in requests) {
            total++
        }
        return total
    },
    totalApprovedRequest(state) {
        let total = 0
        let requests = state.requests.filter(item => item.status === 'Approved')
        for (const obj in requests) {
            total++
        }
        return total
    },
    totalExpiredRequest(state) {
        let total = 0
        let requests = state.requests.filter(item => item.status === 'Expired')
        for (const obj in requests) {
            total++
        }
        return total
    },
    totalDeniedRequest(state) {
        let total = 0
        let requests = state.requests.filter(item => item.status === 'Denied')
        for (const obj in requests) {
            total++
        }
        return total
    },

}

/* STORE MUTATIONS */
const mutations = {
    /* FETCH FILE DATA FROM STORE STATES */
    GET_REQUESTS: (state, data) => {
        state.requests = data
    },


    /* UPDATE REQUESTS DATA FROM STORE STATES */
    UPDATE_REQUEST: (state, data) => {
        const index = state.requests.findIndex(item => item.request_id === data.request_id)
        state.requests.splice(index, 1, data)
    },


    /* DELETE REQUESTS DATA FROM STORE STATES */
    DELETE_REQUEST: (state, data) => {
        for (let i = 0; i < data.length; i++) {
            const index = state.requests.findIndex(item => item.request_id === data[i])
            state.requests.splice(index, 1)
        }
    },


    /* ADD REQUESTS DATA FROM STORE STATES */
    ADD_REQUEST: (state) => {

    },
    SET_REQUEST_FORM: (state, data) => {
        state.request_form = data
    },
    SET_REQUEST_DOCUMENT: (state, data) => {
        state.request_document = data
    },
    SET_REQUEST_REPORT: (state, data) => {
        state.request_report = data
    },
    SET_REQUEST_REPORT_WEEKLY: (state, data) => {
        state.request_report_weekly = data
    },
    SET_REQUEST_REPORT_MONTHLY: (state, data) => {
        state.request_report_monthly = data
    },
    SET_REQUEST_REPORT_YEARLY: (state, data) => {
        state.request_report_yearly = data
    },
    SET_FILE_REQUEST_REPORTS:(state,data) => {
        state.file_request_reports = data
    }
    


}

/* STORE ACTIONS */
const actions = {

    /* FETCH REQUESTS DATA FROM DATABASE */
    async getRequests({ commit }) {

        try {

            await axios.get('/api/requests').then((response) => {
                commit('GET_REQUESTS', response.data.data)
            }).catch((err) => {
                console.log(err.response.data)
            });

        } catch (error) {
            console.log(error)
        }

    },



    /* UPDATE REQUESTS DATA FROM DATABASE */
    async updateRequest({ commit, state, rootState }, payload) {
        rootState.base.isLoading = true
        try {
            axios.put('/api/requests/' + payload.request_id, payload).then((response) => {
                const data = Object.assign(response.data.data, payload)
                commit('UPDATE_REQUEST', data)

                //Notifaction
                rootState.base.global = Object.assign({
                    message: [{ sucess: "Request successfully updated" }],
                    status: "Success",
                    showMsg: true
                })
            }).catch((err) => {

                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: "Error",
                    showMsg: true
                })
            }).finally(function () {
                rootState.base.isLoading = false
            })
        } catch (error) {

        }

    },
    async showRequestDocument({ commit, rootState }, payload) {
        try {
            //const file_location_data = rootState.files.file_location.find(item => item.file_id === payload.file_id)
            console.log(rootState.files.file_location)
            await axios.get('/api/filelocations/' + payload.file_location_id).then((response) => {
                commit('SET_REQUEST_DOCUMENT', response.data)
                
            }).catch((err) => {
                console.log(err.response.data)
            });
        } catch (error) {
            console.log(error)
        }
    },




    /* DELETE REQUESTS DATA FROM DATABASE */
    async deleteRequest({ commit, rootState }, request_id) {
        rootState.base.isLoading = true
        try {
            await axios.delete('/api/requests/' + request_id).then((response) => {
                commit('DELETE_REQUEST', response.data.data)
                //Notifaction
                rootState.base.global = Object.assign({
                    message: [{ sucess: "Request successfully deleted" }],
                    status: "Success",
                    showMsg: true
                })
            }).catch((err) => {

                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: "Error",
                    showMsg: true
                })
            }).finally(function () {
                rootState.base.isLoading = false
            });
        } catch (error) {
            console.log(error)
        }
    },
    /* async deleteMultipleRequestLog({commit,rootState},data) {
        rootState.base.isLoading = true
        try {
            
        } catch (error) {
            console.error();
        }
    }, */

    async deleteMultipleRequest({ commit, rootState }, records) {
        rootState.base.isLoading = true
        try {
            await axios.post('/api/destroyrecords', records).then((response) => {

                commit('DELETE_REQUEST', records)
                //Notifaction
                rootState.base.global = Object.assign({
                    message: [{ sucess: "Request successfully deleted" }],
                    status: "Success",
                    showMsg: true
                })
            }).catch((err) => {
                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: "Error",
                    showMsg: true
                })
            }).finally(function () {
                rootState.base.isLoading = false
            });
        } catch (error) {
            console.log(error)
        }
    },


    async showRequestForm({ commit, rootState }, req) {
        rootState.base.isLoading = true
        try {

            await axios.get('/api/requests/' + req.request_id).then((response) => {

                commit('SET_REQUEST_FORM', response.data)

            }).catch((err) => {

                console.log(err.response.data)

            }).finally(function () {

                rootState.base.isLoading = false
            });
        } catch (error) {
            console.log(error)
        }
    },



    /* ADD REQUESTS TO DATABASE */
    async addRequest({ commit, rootState }, data) {

        rootState.base.isLoading = true

        const req = Object.fromEntries(data)


        try {

            await axios.post('/api/requests', data, {

                headers: {
                    'Content-Type': "multipart/form-data"
                }

            }).then((response) => {


                //Notifaction
                rootState.base.global = Object.assign({
                    message: [{ sucess: "Request successfully sent" }],
                    status: "Success",
                    showMsg: true
                })
            }).catch((err) => {


                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: "Error",
                    showMsg: true
                })
            }).finally(function () {

                rootState.base.isLoading = false

            });

        } catch (error) {

            console.log(error)

        }

    },
    async getRequestReportsDaily({ commit }) {
        try {
            await axios.get('/api/requestreportsdaily').then((response) => {

                
                commit('SET_REQUEST_REPORT', response.data)

            }).catch((err) => {

                console.log(err.response.data)

            });
            
        }

        catch (error) {

            console.log(error)

        }
    },
    async getFileRequestReports({commit}) {
        try {
            await axios.get('/api/filerequestreports').then((response) => {
                commit("SET_FILE_REQUEST_REPORTS",response.data.data)
            }).catch((err) => {
                console.log(err.response.data)
            }).finally(function() {
            })
        } catch (error) {
            console.log(error)
        }
    },
    async getRequestReportsWeekly({ commit }) {

        try {

            await axios.get('/api/requestreportsweekly').then((response) => {

                let request_reports = response.data
                
                let data = []

                for (let i = 0; i < Object.values(request_reports).length; i++) {

                    let total = Object.values(request_reports)[i].filter(item => item.status === 'Approved' || item.status === 'Pending').length
                    let approved = Object.values(request_reports)[i].filter(item => item.status === 'Approved').length
                    let date = Object.keys(request_reports)[i]

                    data.push({total,date,approved})

                }
                commit('SET_REQUEST_REPORT_WEEKLY', data)

            }).catch((err) => {

                console.log(err.response.data)

            });
        }

        catch (error) {

            console.log(error)

        }
    },
    async getRequestReportsMonthly({ commit }) {
        try {
            await axios.get('/api/requestreportsmonthly').then((response) => {
                
                let request_reports = response.data

                let data = []

                for(let i = 0;i<Object.values(request_reports).length;i++) {

                    let date = Object.keys(request_reports)[i]

                    let total = Object.values(request_reports)[i].filter(item => item.status === 'Approved' || item.status === 'Pending').length
                    let approved = Object.values(request_reports)[i].filter(item => item.status === 'Approved').length
                    let pending = Object.values(request_reports)[i].filter(item => item.status === 'Pending').length
                    let denied = Object.values(request_reports)[i].filter(item => item.status === 'Denied').length
                    let expired = Object.values(request_reports)[i].filter(item => item.status === 'Expired').length

                    data.push({total,date,approved,pending,denied,expired})
                }

                commit('SET_REQUEST_REPORT_MONTHLY', data)
                
            }).catch((err) => {

                console.log(err.response.data)
                
            });
        }
        catch (error) {
            console.log(error)
        }
    },

    async getRequestReportsYearly({ commit }) {
        try {
            await axios.get('/api/requestreportsyearly').then((response) => {
                
                let request_reports = response.data
                let data = []

                for(let i = 0;i<Object.values(request_reports).length;i++) {
                    let date = Object.keys(request_reports)[i]

                    

                    data.push({date})
                }

                commit('SET_REQUEST_REPORT_YEARLY', data)
                
            }).catch((err) => {

                console.log(err.response.data)
                
            });
        }
        catch (error) {
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
