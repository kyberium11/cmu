<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="16" md="12">

        <v-card>
          <v-data-table
            :headers="headers"
            :items="data"
            dense
            class="elevation-1 table-striped"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{table_title}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card v-show="report == 'request_reports'">
          <v-data-table
            :headers="fileRequestReportsTableHeader"
            :items="filerequestreports"
            dense
            class="elevation-1 table-striped"

          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>File Requests Reports Table</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  props: ["period", "data", "filerequestreports","report"],
  data() {
    return {
        table_title:"",
        icon:"justify",
      //TABLE HEADERS PROPERTIES REQUEST REPORTS
      headers: [],
      //TABLE HEADERS PROPERTIES REQUEST REPORTS
      fileRequestReportsTableHeader: [
        {
          text: "Filename",
          align: "start",
          sortable: true,
          value: "filename",
          class: "info text-black",
        },
        {
          text: "Category",
          value: "category",
          class: "info text-black",
        },
        {
          text: "Total of Requests",
          value: "totalrequests",
          class: "info text-black",
        },
      ],

      //USERS PROPERTIES
      users: [],
      selectedUser: null,
      editedIndex: -1,
      usertype: ["Chief", "Staff"],
    };
  },

  created() {
      if(this.report === 'request_reports') {
          this.table_title = 'Total No. Of Requested Records'
          this.headers.push({
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
          class: "info text-black",
        },
        {
          text: "Total no. of Requests",
          value: "total",
          class: "info text-black",
        },
        {
          text: "Pending",
          value: "pending",
          class: "info text-black",
        },
        {
          text: "Approved",
          value: "approved",
          class: "info text-black",
        },
        {
          text: "Denied",
          value: "denied",
          class: "info text-black",
        },
        {
          text: "Expired",
          value: "expired",
          class: "info text-black",
        })
      }else {
           this.table_title = 'Upload Document Reports'
           this.headers.push({
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
          class: "info text-black",
        },
         {
          text: "Total Uploaded",
          value: "total_uploaded",
          class: "info text-black",
        },
        {
          text: "Total Archived",
          value: "total_archive",
          class: "info text-black",
        },
        {
          text: "Total Disposed",
          value: "total_dispose",
          class: "info text-black",
        },)
      }
  }
};
</script>
