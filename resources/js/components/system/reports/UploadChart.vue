<template>
  <v-container>
  
    <bar-chart :chartData="chartData" :options="options"></bar-chart>

  </v-container>
</template>

<script>
import BarChart from "./BarChart.vue";
export default {
  components: { BarChart },
  props:['chartData','options'],
 
};
</script>