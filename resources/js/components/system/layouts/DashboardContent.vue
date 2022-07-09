<template>
<div class="container">
    <transition class="fade" enter-active-class="animate__animated animate__fadeIn" mode="out-in">
     <router-view></router-view>
</transition>
</div>
</template>
<script>
import DashboardHeader from "./DashboardHeader.vue";
export default {
  components: {
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
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 1.5s ease;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
