<template>
    <v-app id="app">
        <navigation/>
        <div class="main-content">
            <dashboard-header/>
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
    }
    
}
</script>

