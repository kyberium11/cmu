import axios from "axios";


/* STORE STATES */
const getDefaultSate = () => {
    return {
        files: [],
        file_location: [],
        show_file: null,
        upload_reports_monthly: [],
        upload_reports_yearly: [],
        file_disposal:[]
    }
}

/* DEFAULT STORE STATES */
const state = getDefaultSate()


/* STORE GETTERS */
const getters = {
    totalDocuments(state) {
        let total = 0;
        for (const obj of state.file_location) {
            total++
        }
        return total
    },
    getAllDocs(state) {
        return state.files.filter(item => item.archive === 'Unarchive' && item.retention_status === 'Active')
    },
    getFileLocations(state) {
        return state.file_location.filter(item => item.archive === 'Unarchive' && item.retention_status === 'Active')
    },
    getDocuments(state) {
        return state.file_location.filter(item => item.file_status === 'Approved' && item.archive === 'Unarchive' && item.retention_status === 'Active')
    },
    getDocumentsForDisposal(state) {
        let files = state.file_location.filter(item => item.file_status === 'Approved' && item.archive === 'Unarchive' && item.retention_status === 'Active')
        const now = new Date();
        let datenow = null
        now.setDate(now.getDate()).toString();
        var converted_timestamp = new Date(now),
            mnth = ("0" + (converted_timestamp.getMonth() + 1)).slice(-2),
            day = ("0" + converted_timestamp.getDate()).slice(-2),
            hours = ("0" + converted_timestamp.getHours()).slice(-2),
            minutes = ("0" + converted_timestamp.getMinutes()).slice(-2),
            seconds = ("0" + converted_timestamp.getSeconds()).slice(-2);
        datenow =
            converted_timestamp.getFullYear() +
            "-" +
            mnth +
            "-" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        let filesfordispose = files.filter(item => new Date(item.retention_date) <= new Date(datenow))
        return filesfordispose
    },
    filterFilesByCategory: (state) => (category_id) => {
        return state.file_location.filter(item => item.file_status === 'Approved' && item.archive === 'Unarchive' && item.category_id === category_id)
    },
    getApprovedDocuments(state) {
        return state.files.filter(item => item.file_status === 'Approved')
    },
    totalArchiveDocuments(state) {
        let total = 0
        let archive = state.files.filter(item => item.archive === 'Unarchive')
        for (const obj of archive) {
            total++
        }
        return total
    },
    totalUnarchivedDocuments(state) {
        let total = 0
        let unarchive = state.files.filter(item => item.archive === 'Unarchive')
        for (const obj of unarchive) {
            total++
        }
        return total
    },
    totalDisposedDocuments(state) {
        let total = 0
        let dispose = state.files.filter(item => item.retention_status === 'Dispose')
        for (const obj of dispose) {
            total++
        }
        return total
    },

}

/* STORE MUTATIONS */
const mutations = {
    /* FETCH FILE DATA FROM STORE STATES */
    GET_FILES: (state, fileList, user) => {
        state.files = fileList
    },
    GET_FILE_DISPOSAL:(state,data) => {
        state.file_disposal = data
    },


    /* UPDATE FILE DATA FROM STORE STATES */
    UPDATE_FILE: (state, file) => {
        const index = state.files.findIndex(item => item.file_id === file.file_id)
        state.files.splice(index, 1, file)
    },
    UPDATE_FILE_DISPOSAL: (state, file) => {
        const index = state.file_disposal.findIndex(item => item.file_id === file.file_id)
        state.file_disposal.splice(index, 1)
    },


    /* DELETE FILE DATA FROM STORE STATES */
    DELETE_FILE: (state, data) => {
        for (let i = 0; i < data.length; i++) {
            const index = state.files.findIndex(item => item.request_id === data[i])
            state.files.splice(index, 1)
        }
    },



    /* ADD FILE DATA FROM STORE STATES */
    ADD_FILE: (state, file) => {
        delete file.file_location
        state.files.push(file)
    },


    /* GET FILE LOCATIONS FROM STORE STATES */

    GET_FILE_LOCATIONS: (state, file) => {
        state.file_location = file
    },

    /* ADD FILE LOCATION FROM STORE STATES */
    ADD_FILE_LOCATIONS: (state, file) => {
        state.file_location.push(file)
    },

    /* UPDATE FILE LOCATION FROM STORE STATES */
    UPDATE_FILE_LOCATION: (state, file) => {
        const index = state.file_location.findIndex(item => item.file_location_id === file.file_location_id)
        state.file_location.splice(index, 1, file)
    },

    /* DELETE FILE LOCATION FROM STORE STATES */
    DELETE_FILE_LOCATION: (state, file) => {
        for (let i = 0; i < file.length; i++) {
            const index = state.file_location.findIndex(item => item.file_id === file[i])
            state.file_location.splice(index, 1)
        }
    },


    SHOW_FILE: (state, file) => {
        state.show_file = file
    },


    SET_UPLOAD_REPORTS_MONTHLY: (state, data) => {
        state.upload_reports_monthly = data
    },
    SET_UPLOAD_REPORTS_YEARLY: (state, data) => {
        state.upload_reports_yearly = data
    },


}

/* STORE ACTIONS */
const actions = {

    async getFileDisposal({commit,rootState}) {
        rootState.base.isLoading = true
        try {
            await axios.get('/api/filedisposal').then((response) => {
                commit("GET_FILE_DISPOSAL", response.data)
            }).catch((err) => {

                console.log(err.response.data)

            }).finally(function() {
                rootState.base.isLoading = false
            });

        } catch (e) {

            console.log(e)

        }
    },

    /* FETCH FILE DATA FROM DATABASE */
    async getFileList({ commit, rootState }) {
        rootState.base.isLoading = true
        try {
            await axios.get('/api/files').then((response) => {
                commit("GET_FILES", response.data.data)
            }).catch((err) => {

                console.log(err.response.data)

            }).finally(function() {
                rootState.base.isLoading = false
            });;

        } catch (e) {

            console.log(e)

        }
    },


    /* UPDATE FILE DATA FROM DATABASE */
    async updateFile({ commit, rootState }, payload) {
        rootState.base.isLoading = true
        try {
            await axios.put('/api/files/' + payload.file_id, payload).then((response) => {
                commit("UPDATE_FILE", payload)
                commit("UPDATE_FILE_DISPOSAL", payload)

                //Notification
                rootState.base.global = Object.assign({
                    message: [{ success: "File successfulyy updated" }],
                    status: 'Success',
                    showMsg: true,
                })


            }).catch((err) => {


                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })
            }).finally(function () {

                rootState.base.isLoading = false

            });

        } catch (e) {

            console.log(e)

        }
    },




    /* DELETE FILE DATA FROM DATABASE */
    async deleteFile({ commit, state, rootState }, file) {
        rootState.base.isLoading = true
        try {
            await axios.delete('/api/files/' + file.file_id).then((response) => {
                commit("DELETE_FILE", response.data)
                //Notification
                rootState.base.global = Object.assign({
                    message: [{ success: "Document successfulyy deleted" }],
                    status: 'Success',
                    showMsg: true,
                })
            }).catch((err) => {
                if (err.response.status === 500) {
                    //Notification
                    rootState.base.global = Object.assign({
                        message: { message: "Ops! Something went wrong, this file is already in the file location. Delete this file in the file location first." },
                        status: 'Error',
                        showMsg: true,
                    })
                } else {

                }
                console.log(err)
            }).finally(function () {
                rootState.base.isLoading = false
            });

        } catch (e) {

            console.log(e)

        }
    },

    async deleteMultipleFiles({ commit, rootState }, records) {
        rootState.base.isLoading = true
        try {
            await axios.post('/api/destroyfilerecords', records).then((response) => {
                commit('DELETE_FILE', records)

                //Notifaction
                rootState.base.global = Object.assign({
                    message: [{ sucess: "Request successfully deleted" }],
                    status: "Success",
                    showMsg: true
                })

            }).catch((err) => {
                if (err.response.status === 500) {
                    //Notification
                    rootState.base.global = Object.assign({
                        message: { message: "Ops! Something went wrong, this file is already in the file location. Delete this file in the file location first." },
                        status: 'Error',
                        showMsg: true,
                    })
                } else {

                }
                console.log(err)
            }).finally(function () {
                rootState.base.isLoading = false
            });
        } catch (error) {
            console.log(error)
        }
    },



    /* ADD FILE TO DATABASE */
    async addFile({ commit, rootState }, payload) {
        rootState.base.isLoading = true
        try {
            axios.post('/api/files', payload).then((response) => {
                commit("ADD_FILE", response.data.data)

                //Notification
                rootState.base.global = Object.assign({
                    message: [{ success: "Document successfulyy added" }],
                    status: 'Success',
                    showMsg: true,
                })
            }).catch((err) => {
                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })
            }).finally(function () {
                rootState.base.isLoading = false
            })

        } catch (e) {

            console.log(e)

        }
    },



    /* FETCH FILE lOCATION DATA FROM DATABASE */
    async getFileLocations({ commit, rootState }) {
        try {
            await axios.get('/api/filelocations').then((response) => {

                commit("GET_FILE_LOCATIONS", response.data.data)

            }).catch((err) => {

                console.log(err.response.data)

            });



        } catch (e) {

            console.log(e)

        }
    },

    async addFileLocation({ commit, state, rootState }, data) {
        rootState.base.isLoading = true
        const file_location = data.get('file_location').name.toString()

        const file_id = parseInt(data.get('file_id'))

        const file_data = state.files.find(o => o.file_id === file_id)


        const index = state.file_location.findIndex(item => item.file_id === file_id)

        try {
            if (index === -1) {

                axios.post('/api/filelocations', data, {
                    headers: {
                        'Content-Type': "multipart/form-data"
                    }
                }).then((response) => {
                    const file_location_id = response.data.data.file_location_id
                    const file_location = response.data.data.file_location
                    const file = Object.assign(file_data, file_id, { file_location_id }, { file_location })
                    commit("ADD_FILE_LOCATIONS", file)

                    //notifacation
                    rootState.base.global = Object.assign({
                        message: [{ success: "File successfulyy uploaded" }],
                        status: 'Success',
                        showMsg: true,
                    })

                }).catch((err) => {

                    //Notification
                    rootState.base.global = Object.assign({
                        message: err.response.data,
                        status: 'Error',
                        showMsg: true,
                    })

                }).finally(function () {
                    rootState.base.isLoading = false
                })
            }
            else {
                //Notification
                rootState.base.global = Object.assign({
                    message: { message: "Ops! Something went wrong! This file is already taken in the file locations. If you want to upload this file you can update the file location." },
                    status: 'Error',
                    showMsg: true,
                })
                rootState.base.isLoading = false
            }
        } catch (e) {

            console.log(e)

        }

    },
    async updateFileLocation({ commit, state, rootState }, data) {

        rootState.base.isLoading = true

        const file_location = data.get('file_location')

        const filename = data.get('filename')

        const file_id = parseInt(data.get('file_id'))

        const file_location_data = state.file_location.find(item => item.file_id === file_id)

        const file_data = state.files.find(item => item.file_id === file_id)

        const file = Object.assign({ file_id: file_id, file_location: file_location })

        axios.post('/api/filelocations/' + file_location_data.file_location_id, data, {
            headers: {
                'Content-Type': "multipart/form-data"
            }
        }).then((response) => {
            const file_location_id = response.data.data.file_location_id
            const file_location = response.data.data.file_location
            const updated_at = response.data.data.updated_at
            const file = Object.assign(file_data, file_id, { updated_at }, { file_location_id }, { file_location })
            commit("UPDATE_FILE_LOCATION", file)

            //notifacation
            rootState.base.global = Object.assign({
                message: [{ success: "File successfulyy updated" }],
                status: 'Success',
                showMsg: true,
            })

        }).catch((err) => {

            //Notification
            rootState.base.global = Object.assign({
                message: err.response.data,
                status: 'Error',
                showMsg: true,
            })

        }).finally(function () {
            rootState.base.isLoading = false
        })
    },

    async showFile({ commit, state, rootState }, filelocation) {
        try {
            await axios.get('/api/filelocations/' + filelocation.file_location_id).then((response) => {
                commit('SHOW_FILE', response.data)
            }).catch((err) => {
                console.log(err.response.data)
            });
        } catch (error) {
            console.log(error)
        }
    },


    async deleteFileLocation({ commit, state, rootState }, filelocation) {
        rootState.base.isLoading = true
        try {
            await axios.post('/api/destroyfilelocationrecords', filelocation).then((response) => {
                commit('DELETE_FILE_LOCATION', filelocation)

                //notifacation
                rootState.base.global = Object.assign({
                    message: [{ success: "File Location successfulyy deleted" }],
                    status: 'Success',
                    showMsg: true,
                })


            }).catch((err) => {

                //Notification
                rootState.base.global = Object.assign({
                    message: err.response.data,
                    status: 'Error',
                    showMsg: true,
                })
            }).finally(function () { rootState.base.isLoading = false });
        } catch (error) {
            console.log(error)
        }
    },

    async getUploadReportsMonthly({ commit }) {
        try {
            await axios.get('/api/uploadreportsmonthly').then((response) => {
                let montlyreports = response.data
                commit('SET_UPLOAD_REPORTS_MONTHLY', montlyreports)
            }).catch((err) => {

                console.log(err.response.data)

            });
        }
        catch (error) {
            console.log(error)
        }
    },
    async getUploadReportsYearly({ commit }) {
        try {
            await axios.get('/api/uploadreportsyearly').then((response) => {

                let yearlyreports = response.data

                /* let data = []

                for (let i = 0; i < Object.values(upload_reports).length; i++) {

                    let date = Object.keys(upload_reports)[i]

                    let total = Object.values(upload_reports)[i].filter(item => item.file_status === 'Approved').length

                    data.push({ total, date })
                } */

                commit('SET_UPLOAD_REPORTS_YEARLY', yearlyreports)
            }).catch((err) => {

                console.log(err.response.data)

            });
        }
        catch (error) {
            console.log(error)
        }
    },
    async downloadDocuments({ rootState, state, commit }, docs) {
        rootState.base.isLoading = true
        try {

            let link = document.createElement('a')
            link.href = docs.file_url
            link.download = docs.file_name

            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)

        } catch (error) {

            console.log(error)

        } finally {
            setTimeout(() => {
                rootState.base.isLoading = false
            }, 1000);
        }
    },


}

export default {

    state,
    getters,
    mutations,
    actions
}
