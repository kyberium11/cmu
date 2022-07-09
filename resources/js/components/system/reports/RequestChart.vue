<template>
  <v-container>
  
    <chart :chartData="chartData" :options="options"></chart>

  </v-container>
</template>

<script>
import Chart from "./Chart.vue";
export default {
  components: { Chart },
  props:['chartData','options'],
 
};
</script>