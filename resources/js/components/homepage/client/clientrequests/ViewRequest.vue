<template>
    <div class="mt-15">
        <div class="container shadow p-3 mb-5 bg-white">
      <div class="row">
          <h1>View Request</h1>
          {{file_id}}
          {{getData}}
      </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['file_id'],
    data() {
        return {
        }
    },
    computed:{
        getData() {
            return this.$store.state.files.files.filter(item => item.file_id === this.$router.params.file_id)
        }
    },
    mounted() {

    this.$store.dispatch("getRequests")
    this.$store.dispatch("getFileList")
    this.$store.dispatch("getFileLocations")
    }

}
</script>