<template>
  <div class="mt-15">
    <div class="container shadow p-3 mb-5 bg-white">
      <div class="row">
        <h1><v-icon size="50" color="info">mdi-swap-horizontal</v-icon>Requests Management</h1>

        <v-card>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <template v-slot:extension>
              <v-tabs v-model="tabs">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#mobile-tabs-5-1" class="primary--text">
                  <v-icon>mdi-account-arrow-right-outline </v-icon> Requests
                </v-tab>

                <v-tab href="#mobile-tabs-5-2" class="primary--text">
                  <v-icon>mdi-table </v-icon> Request Log
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="i in 2" :key="i" :value="'mobile-tabs-5-' + i">
              <v-card flat v-if="i === 1">
                  <request-table />
              </v-card>
              <v-card flat v-if="i === 2">
                  <request-log-table/>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import RequestTable from "./RequestTable.vue";
import RequestLogTable from "./RequestLogTable.vue";
export default {
  components: { RequestTable, RequestLogTable },
  data() {
      return {
          tabs:null
      }
  },
  created() {
    this.$store.dispatch("getRequests")
  }
};
</script>
