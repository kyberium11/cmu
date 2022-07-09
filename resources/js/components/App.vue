<template>
<v-app>
    <router-view></router-view>
</v-app>
</template>
<script>
export default {
    mounted() {
      this.$store.dispatch("getUserList")
    }
}
</script>

