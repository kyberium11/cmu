<template>
  <div class="mt-3">
        <v-layout row justify-center align-center>
          <div class="float-left">
            <v-col cols="12" md="3" sm="5">
              <v-btn text @click="$router.push({ name: 'homepage' })">
                <v-icon>mdi-arrow-left</v-icon>Back to Home
                </v-btn
              >
            </v-col>
          </div>
        </v-layout>
        <div class="mt-15"> 
          <v-layout row justify-center align-center>
           <v-card max-width="800">
                <!-- Alert Message -->
              <div v-if="msgStatus">
                <alert-component />
              </div>
        <v-card-text>
          <h3 class="display-7 text-uppercase">Forgot Password</h3>
          <p>CMUDAS Password Recovery.</p>
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
                    label="Email Address"
                    outlined
                    dense
                    prepend-inner-icon="mdi-email"
                    :rules="rules.email"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

            </v-form>
          </v-container>
          <a href="#" class="text-uppercase"  @click="$router.push({ name: 'authentication',params:{action:'login'} })">Login</a>

        </v-card-text>
        <!-- Form Buttons -->

        <v-card-actions>
          <v-row>
            <v-col cols="12" md="6" sm="4">
              <v-btn x-large :disabled="!rules.isValid" color="success" dark @click="save">
            Send
          </v-btn>
            </v-col>
          </v-row>

        </v-card-actions>
      </v-card>
          </v-layout>
        </div>
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
      },


      //Rules Validation Property
      rules: {
        isValid: true,
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
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
    redirectToHome() {
      this.$router.push({ name: "homepage" });
    },
    //SAVE FORM
    forgotPassword() {
        this.$store.dispatch("forgotPassword",this.form)
    },
    redirectLogin() {

      this.$router.push({ name: "authentication",params:{action:'login'} });

    },
    showRegister(register) {

      this.$emit("type", register);

    },
    save() {
      this.forgotPassword()
      this.$refs.form.validate()
      this.msgStatus = true
      
    },
  },
};
</script>
<style scoped>
.img {
  border:1px solid #000;

}
.right-container {
  /* background-image:url('../../../../../public/images/authentication.svg'); */
  background-color: #21c65e;
  border: 1px solid #000;
}
::v-deep .v-btn {
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
}
</style>
