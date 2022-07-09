<template>
        <div class="mt-15">
            <div class="container shadow p-3 mb-5 bg-white">
                <div class="row">
                    <h4 class="text-uppercase">welcome {{auth.user.name}} </h4>
                    <file-list/>

                </div>
            </div>

        </div>
</template>
<script>
import FileList from './FileList.vue'
export default {
    components:{FileList},
    computed:{
        auth() {
            return this.$store.state.auth
        }
    },
    created() {
        this.$store.dispatch("getFileList")
        this.$store.dispatch("getFileLocations")
        this.$store.dispatch("getFileCategory")

    }
}
</script>
<style scoped>
.content {
    background: #fff;
}
</style>
