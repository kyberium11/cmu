<template>
        <div class="mt-15">
            <div class="container shadow p-3 mb-5 bg-white">
                <h1><v-icon size="50" color="info">mdi-account</v-icon>Profile</h1>
                <profile></profile>


            </div>

        </div>
</template>

<script>
import Profile from './Profile.vue'
export default {
    components:{Profile}
}
</script>

<style scoped>
.content {
    background: #fff;
}
</style>
