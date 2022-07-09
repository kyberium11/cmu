<template>
  <div class="mt-15">
    <div class="container shadow p-3 mb-5 bg-white">
      <div class="row">
        <h1><v-icon size="50" color="info">mdi-swap-horizontal</v-icon>Client Requests</h1>
        <v-card>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <template v-slot:extension>
              <v-tabs v-model="tabs">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#mobile-tabs-5-1" class="primary--text">
                  <v-icon>mdi-swap-horizontal </v-icon> Request
                </v-tab>

              
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="i in 2" :key="i" :value="'mobile-tabs-5-' + i">
              <v-card flat v-if="i === 1">

                <client-requests-table />

              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>

      </div>
    </div>
  </div>
</template>

<script>
import ClientRequestsTable from "./ClientRequestsTable.vue";
import ClientRequestsLogTable from './ClientRequestLogTable.vue'
export default {
  components: { ClientRequestsTable,ClientRequestsLogTable },
  data() {
      return {
          tabs:null
      }
  },
  created() {
    this.$store.dispatch("getRequests")
    this.$store.dispatch("getFileList")
    this.$store.dispatch("getFileLocations")
  },
};
</script>

<style scoped>
.content {
  background: #fff;
}
</style>
