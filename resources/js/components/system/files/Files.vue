<template>
  <div class="mt-15">
    <div class="container shadow p-3 mb-5 bg-white">
      <div class="row">
        <h1><v-icon size="50" color="info">mdi-file-outline</v-icon>Document Management</h1>
        <v-card>
          <v-toolbar flat>

            <v-spacer></v-spacer>
            <template v-slot:extension>
              <v-tabs v-model="tabs">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#mobile-tabs-5-1" class="primary--text">
                  <v-icon>mdi-folder </v-icon> Documents
                </v-tab>

                <v-tab href="#mobile-tabs-5-2" class="primary--text">
                  <v-icon>mdi-file-cabinet </v-icon> File Locations
                </v-tab>
                <v-tab href="#mobile-tabs-5-3" class="primary--text" v-show="auth.user_type === 'Staff'">
                  <v-icon>mdi-file-compare </v-icon> File Disposal
                </v-tab>
                <v-tab href="#mobile-tabs-5-4" class="primary--text" v-show="auth.user_type === 'Chief'">
                  <v-icon>mdi-file-compare </v-icon> File Category
                </v-tab>

              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="i in 4" :key="i" :value="'mobile-tabs-5-' + i">


              <v-card flat v-if="i === 1">
                  <file-table />
              </v-card>


              <v-card flat v-if="i === 2">
                  <file-location-table/>
              </v-card>

               <v-card flat v-if="i === 3">
                 <file-disposal-table/>

              </v-card>

              <v-card flat v-if="i === 4">
                  <file-category-table/>
              </v-card>


            </v-tab-item>
          </v-tabs-items>
        </v-card>

      </div>
    </div>
  </div>
</template>

<script>
import FileTable from "./FilesTable.vue";
import FileLocationTable from "./FileLocationTable.vue"
import FileCategoryTable from './FileCategoryTable.vue'
import FileDisposalTable from './FileDisposalTable.vue'
export default {
  components: { FileTable,FileLocationTable,FileCategoryTable,FileDisposalTable },
  data() {
      return {
          tabs:null,
          category_id:0,
      }
  },
  computed:{
    auth() {
      return this.$store.state.auth.user
    }
  },

  created() {
    this.$store.dispatch("getFileList")
    this.$store.dispatch("getFileLocations")
    this.$store.dispatch("getFileCategory")
    this.$store.dispatch("getFileDisposal")
  }
};
</script>
