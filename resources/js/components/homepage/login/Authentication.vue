<template>
  <div class="mt-3">
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row class="flex">
      <v-col cols="12" md="6" sm="8"  class="pa-3 d-flex flex-column mt-15">
          <div v-if="action === 'login'">
              <login></login>
          </div>
          <div v-else-if="action === 'forgot-password'">
              <forgot-password></forgot-password>
          </div>
          <div v-else-if="action === 'reset-password'">
              <reset-password></reset-password>
          </div>
          <div v-else>
              <register></register>
          </div>


      </v-col>
      <v-col cols="12" md="6" sm="8" class="pa-3 d-flex flex-column right-container">
        <img :src="loginInfoGraphic" class="mt-n15 img" width="100%" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Login from './Login.vue'
import Register from './Register.vue'
import ForgotPassword from './ForgotPassword.vue'
import ResetPassword from './ResetPassword.vue'
import loginInfoGraphic from "../../../../../public/images/authentication.svg";
export default {
  components: { Login,Register,ForgotPassword,ResetPassword },
  data() {
    return {
      loginInfoGraphic: loginInfoGraphic,
    };
  },
  computed: {
    //ISLOADING COMPUTED
    action() {
        return this.$route.params.action
    },
    isLoading: {
      get: function () {
        return this.$store.state.base.isLoading;
      },

      set: function (newVal) {
        return newVal;
      },
    },
  },
};
</script>
<style scoped>
.img {
    height: 120vh;
}
.right-container {
  background-color: #21c65e;

}
::v-deep .v-btn {
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
}
</style>
