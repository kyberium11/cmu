<template>
<div>
  <dashboard-header/>
    <transition class="fade" enter-active-class="animate__animated animate__fadeIn" mode="out-in">
     <router-view></router-view>
</transition>
</div>
</template>
<script>
import DashboardHeader from './DashboardHeader.vue'
export default {
  components: {
    DashboardHeader,
  },

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
