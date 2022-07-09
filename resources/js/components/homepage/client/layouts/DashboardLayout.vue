<template>
    <v-app id="app">
        
        <navigation/>
        <div class="main-content">
            
            <dashboard-content/>
        </div>

    </v-app>
</template>

<script>
import DashboardContent from './DashboardContent.vue'
import DashboardHeader from "./DashboardHeader.vue";
import Navigation from './Navigation.vue'

export default {

    components:{
        Navigation,
        DashboardContent,
        DashboardHeader,
    },
     data() {
        return {
            token: localStorage.getItem('token')
        }
    },
    mounted() {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        if(this.token) {
            return this.$store.dispatch("getUser")
        }

        
    }
}
</script>

