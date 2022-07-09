<template>
  <div class="dashboard text-center">
    <div class="header pb-5 pt-2">
      <div class="container">
        <div class="header-body">
          <!-- Card stats -->
          <div class="row">
              <h4>Client Request Summary</h4>
            <div
              class="col-md-6"
              v-for="(items, i) in totalDashboard"
              :key="i"
            >
              <div class="card card-stats mb-3 mb-sm-0" :class="items.bgColor">
                <div class="card-body">
                  <div class="row">
                      <h6
                        class="
                          card-title
                          font-weight-bold
                          text-uppercase
                          mb-0
                          text-black
                        "
                      >
                        {{ items.title }}
                      </h6>

                         <span class="counter font-weight-bold text-black">{{
                        items.count
                      }}</span>
                            <v-icon size="45" :color="items.iconColor" v-text="items.icon"></v-icon>
                    </div>


                    <div class="mx-auto">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dashboard:null,
      user_type:localStorage.getItem("user_type"),
      totalDocs:null,

    };
  },
  computed:{
    auth() {
      return this.$store.state.auth.user
    },
    totalDashboard() {
      let data = []
        return data = [

          {
             title: "Pending Requests",
            count: this.$store.getters.totalPendingApprovedRequest,
            bgColor: "dashboard-item",
            iconColor:'error',
            icon: "mdi-cached",
          },
          {
            title: "Approved Requests",
            count: this.$store.getters.totalApprovedRequest,
            bgColor: "dashboard-item",
            iconColor:'warning',
            icon: "mdi-thumb-up-outline",
          },
          {
            title: "Denied Requests",
            count: this.$store.getters.totalDeniedRequest,
            bgColor: "dashboard-item",
            iconColor:'error',
            icon: "mdi-thumb-down-outline",
          },
          {
            title: "Expired Requests",
            count: this.$store.getters.totalExpiredRequest,
            bgColor: "dashboard-item",
            iconColor:'info',
            icon: "mdi-timer-sand-empty",
          }


        ]

    },
    fetchRequests() {
      const files = this.$store.getters.getPendingRequests
      return this._.orderBy(files, ["created_at"], ["desc"]);
    },
  },
  watch:{
    totalDashboard:function() {

    }
  },


};
</script>
<style scoped>
.dashboard h2,
span,
p,
h5 {
  color: #fff;
}
.dashboard-item {
    background-color: #b8e5fc;
}
.counter {
  font-size: 3rem;
}
.icon-center {
  text-align: center;
  width: 100%;
}
</style>
