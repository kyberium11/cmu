<template>
  <div class="container mt-15">
      <!-- Alert Message -->
      <div v-if="msgStatus">
        <alert-component />
      </div>
      <!-- <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->

      <v-card class="elevation-5 flex d-flex flex-column" outlined>
        <v-card-text>
          <h3 class="display-7 text-uppercase">Login</h3>
          <p>Welcome to CMU Archive, please input your credentials below.</p>
          <v-container>
            <v-form
              ref="form"
              @submit.prevent="save"
              v-model="rules.isValid"
              lazy-validation
            >
              <v-row class="mt-n6">
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    outlined
                    dense
                    prepend-inner-icon="mdi-email"
                    :rules="rules.email"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-n6">
                <v-col cols="12">
                  <v-text-field
                    label="Password"
                    v-model="form.password"
                    outlined
                    dense
                    prepend-inner-icon="mdi-lock"
                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showpass ? 'text' : 'password'"
                    @click:append="showpass = !showpass"
                    :rules="rules.password"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>

        </v-card-text>
        <!-- Form Buttons -->

        <v-card-actions>
          <v-row>
            <v-col cols="12" md="6" sm="4">
              <v-btn x-large :disabled="!rules.isValid" color="success" dark @click="save">
            Login
          </v-btn>
            </v-col>
            <v-col cols="12" md="6" sm="4">
              <v-btn x-large width="100%" text @click="showRegister('Register')"
            >Create an Account</v-btn
          >
            </v-col>
          </v-row>

        </v-card-actions>
      </v-card>
  </div>
</template>
<script>
import AlertComponent from "./../../AlertComponent.vue";
export default {
  components: { AlertComponent },
  data() {
    return {
      //Password Property
      showpassForm: false,
      showpass: false,
      showconfirmpass: false,
      //Error Handlings Property
      error: "",
      msgStatus: false,

      //Form Properties
      form: {
        email: "",
        password: "",
      },


      //Rules Validation Property
      rules: {
        isValid: true,
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        password: [(v) => !!v || "Password is required"],
      },
    };
  },
  computed:{
    //ISLOADING COMPUTED
      isLoading: {
        get: function () {
          return this.$store.state.base.isLoading;
        },

        set: function (newVal) {
          return newVal;
        },
      },
  },
  methods: {
    //SAVE FORM
    showRegister(register) {
      this.$emit("type", register);
    },
    async loginUser() {
      this.$store.state.base.isLoading = true;
      await axios.get("/sanctum/csrf-cookie");

      await axios
        .post("/api/login", this.form)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_type", response.data.user.user_type);
          var user_type = response.data.user.user_type;
          if (user_type === "Chief" || user_type === "Staff") {
            this.$router.push({ name: "systemdashboard" });
          } else {
            this.$router.push({ name: "clientsearch" });
          }
        })
        .catch((err) => {
          var error = Object.assign({
            message: err.response.data,
            status: "Error",
            show: true,
            isLoading: false,
          });
          this.$store.commit("UPDATE_MESSAGE", error);
        })
        .finally(() => {
          this.$store.commit("UPDATE_LOADING", false);
        });
    },
    save() {
      this.msgStatus = true;
      this.$refs.form.validate();
      this.loginUser();
    },
  },
};
</script>
<style scoped>
::v-deep .v-btn {
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
}
</style>
