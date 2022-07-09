<template>
  <div class="mt-15">
    <div class="container shadow p-3 mb-5 bg-white">
      <div class="row">
        <h1><v-icon size="50" color="info">mdi-chart-box-outline</v-icon>Reports</h1>
        <v-card>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <template v-slot:extension>
              <v-tabs v-model="tabs">
                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#mobile-tabs-5-1" class="primary--text" @click="clickRequestTab">
                  <v-icon>mdi-chart-areaspline </v-icon> Requests Reports
                </v-tab>

                <v-tab href="#mobile-tabs-5-2" class="primary--text" @click="clickUploadTab">
                  <v-icon>mdi-chart-bar </v-icon> Upload Reports
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <!-- REPORTS TABS ITEMS -->
          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="i in 2" :key="i" :value="'mobile-tabs-5-' + i">
              <v-card flat v-if="i === 1">
                 <reports-options :requestreports="getRequestData" :report="reports" :filerequestreports="getFileRequestReports" :uploadreports="getUploadsData" @selectperiod="getPeriod" @selection="getSelection" documentid="requestreports" id="options"/>
                <div id="generaterequestreports">


                <!-- REQUEST REPORT CHART TAB -->

                  <h5>APPROVED REQUEST OVERALL: {{ totalApprovedRequest }}</h5>
                  <!-- REQUEST REPORTS COMPONENT
                  <div v-if="selection === 'Chart'">
                    <request-chart
                      :chartData="generateRequestReport"
                      :options="options"
                    />
                  </div>
                  <div v-else-if="selection === 'Table'">
                    <reports-table :report="reports" :period="period" :data="getRequestData" :filerequestreports="getFileRequestReports" />
                  </div>

                  <div v-else> -->
                    {{period}}
                    <v-row>
                      <v-col cols="12" md="12" sm="8">
                        <request-chart
                          :chartData="generateRequestReport"
                          :options="options"
                        />
                      </v-col>
                      <v-col cols="12" md="12" sm="8">
                        <reports-table :report="reports" :period="period" :data="getRequestData" :filerequestreports="getFileRequestReports" />
                      </v-col>
                    </v-row>
                  <!-- </div> -->
                </div>
              </v-card>

              <!-- REQUEST REPORT TABLE TAB -->
              <v-card flat v-if="i === 2">

                <!-- REPORTS SELECTION PERIOD AND REPORT TYPE -->
               <reports-options :requestreports="getRequestData" :report="reports" :filerequestreports="getFileRequestReports" :uploadreports="getUploadsData" @selectperiod="getPeriod" @selection="getSelection" documentid="requestreports" id="options"/>
                <h5>APPROVED UPLOAD DOCUMENTS: {{ totalUploadDocuments }}</h5>

                <div id="generateuploadreports">
                  <!--UPLOAD REPORTS CHART -->
                  <div v-if="selection === 'Chart'">
                    <upload-chart :chartData="generateUploadReport" :options="options"/>
                  </div>
                  <div v-else-if="selection === 'Table'">
                    <reports-table :report="reports" :period="period" :data="getUploadsData"/>
                  </div>

                  <div v-else>
                    <v-row>
                      <v-col cols="12" md="6" sm="8">
                        <upload-chart :chartData="generateUploadReport" :options="options"/>
                      </v-col>
                      <v-col cols="12" md="6" sm="8">
                        <reports-table :report="reports" :period="period" :data="getUploadsData" :filerequestreports="getFileRequestReports"/>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import RequestChart from "./RequestChart.vue";
import ReportsTable from "./ReportsTable.vue";
import ReportsOptions from './ReportsOptions.vue'
import UploadChart from './UploadChart.vue'
export default {
  components: { RequestChart, ReportsTable,ReportsOptions,UploadChart },
  data() {
    return {
      tabs: null,
      period: "Daily",
      selection: "Chart",
      icon: "justify",
      datatype:"requestreport",
      isMonth:true,
      reports:'request_reports'

    };
  },
  computed: {
    //GET DATA OF APPROVED REQUEST FROM STORE
    getFileRequestReports() {
      return this.$store.state.requests.file_request_reports
    },
    getRequestData() {
      switch (this.period) {
        case "Daily":
          return this.$store.state.requests.request_report;
          break;
        case "Weekly":
          return this.$store.state.requests.request_report_weekly;
          break;
        case "Monthly":
          return this.$store.state.requests.request_report_monthly;
          break;
          case "Yearly":
            return this.$store.state.requests.request_report_yearly;
            break;
            default:
              return this.$store.state.requests.request_report;
              break;
      }
    },
    getUploadsData() {
    switch (this.period) {
        case "Monthly":
          return this.$store.state.files.upload_reports_monthly;
          break;
          case "Yearly":
            return this.$store.state.files.upload_reports_yearly;
            break;
            default:
              return this.$store.state.files.upload_reports_monthly;
              break;
      }
    },
    totalApprovedRequest() {
      let approved_req = this.getRequestData;
      let total = approved_req.reduce((n, { total }) => n + total, 0);
      return total;
    },
    totalUploadDocuments() {
      let upload_docs = this.getUploadsData;
      let total = upload_docs.reduce((n, { total_uploaded,total_dispose,total_archive }) => n + total_uploaded+total_archive + total_dispose, 0);
      return total;
    },


    //Generate reports
    generateRequestReport() {
      return this.requestReportChart();
    },
    generateUploadReport() {
      return this.uploadReportChart();
    },

    //CHART OPTIONS
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Reports",
        },
      };
    },
  },
  methods: {
    getPeriod(period) {
      this.period=period
      if(period === 'Monthly') {
        this.isMonth = true
      }else {
        this.isMonth = false
      }
    },
    clickUploadTab() {
      this.period= 'Monthly'
      this.reports = 'upload_reports'
       this.$nextTick(() => {
        this.selection = 'Chart'
      });

    },
    clickRequestTab() {
      this.period= 'Daily'
      this.reports = 'request_reports'
       this.$nextTick(() => {
        this.selection = 'Chart'
      });

    },
    getSelection(selection) {
      this.selection = selection
    },
    uploadReportChart() {

      let request_reports = this.getUploadsData;
        let date = request_reports.map((item) => item.date);
        let totaluploaded = request_reports.map((item) => item.total_uploaded)
        let totalarchive = request_reports.map((item) => item.total_archive)
        let totaldispose = request_reports.map((item) => item.total_dispose)
        let chartData = {
        labels: this.isMonth ? date: date,
        datasets: [
          {
            label: "Upload Documents",
            backgroundColor: "#1E88E5",
            data: totaluploaded,
          },
           {
            label: "Archive",
            backgroundColor: "#FFB74D",
            data: totalarchive,
          },
           {
            label: "Disposed",
            backgroundColor: "#EC407A",
            data: totaldispose,
          },
        ],
      };
      return chartData;

    },
    requestReportChart() {
      let request_reports = this.getRequestData;
      let daily_date = request_reports.map((item) => item.date);
      let daily_total = request_reports.map((item) => item.total);
      let chartData = {
        labels: daily_date,
        datasets: [
          {
            label: "Approved Request",
            backgroundColor: "#FFB74D",
            data: daily_total,
          },
        ],
      };
      return chartData;
    },

  },

  created() {
    this.$store.dispatch("getRequestReportsDaily")
    this.$store.dispatch("getRequestReportsWeekly")
    this.$store.dispatch("getRequestReportsMonthly")
    this.$store.dispatch("getUploadReportsMonthly")
    this.$store.dispatch("getUploadReportsYearly")
    this.$store.dispatch("getFileRequestReports")
  },
};
</script>
<style scoped>
@media print {
  .hidden-print {
    display: none !important;
  }
}
</style>
