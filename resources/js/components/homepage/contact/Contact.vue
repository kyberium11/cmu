<template>
  <div class="container">
    <h3 class="display-6 text-center text-uppercase">Connect With Us</h3>
    <br />

    <div class="row mt-8">
      <!-- Alert Message -->
      <div v-if="msgStatus">
        <alert-component />
      </div>


      <div class="col-md-4">
        <div class="col-md-12 our-address" data-aos="flip-down">
          <div>
            <h6 class="info-title text-uppercase text-black text-center">
              Our Address
            </h6>
            <p class="description opacity-8 text-black text-center">
              Sayre Hwy, Maramag, Bukidnon
            </p>
          </div>
        </div>
        <div class="col-md-12 mt-3 contact" data-aos="flip-down">
          <div>
            <h6 class="info-title text-uppercase text-black text-center">
              Our Phone
            </h6>
            <p class="description opacity-8 text-black text-center">
              (088) 356 1910
            </p>
            <p class="description opacity-8 text-black text-center">
              (088) 356 1910
            </p>
          </div>
        </div>
        <div class="col-md-12 mt-3 contact" data-aos="flip-down">
          <div>
            <h6 class="info-title text-uppercase text-black text-center">
              Our Email
            </h6>
            <p class="description opacity-8 text-black text-center">Address</p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <v-row>
          <v-form
            ref="form"
            @submit.prevent="save"
            v-model="rules.isValid"
            lazy-validation
          >
            <v-text-field
              v-model="form.name"
              :rules="rules.name"
              outlined
              label="Name"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="form.email"
              :rules="rules.email"
              outlined
              label="Email"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="form.subject"
              :rules="rules.subject"
              outlined
              label="Subject"
              dense
            ></v-text-field>
            <v-textarea
              v-model="form.message"
              :rules="rules.message"
              outlined
              name="input-7-4"
              label="Message"
            >
            </v-textarea>
          </v-form>
        </v-row>
        <v-btn
          color="info"
          dark
          @click="sendemail"
          :disabled="!rules.isValid"
          :loading="isLoading"
          >Submit</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import AlertComponent from "./../../AlertComponent.vue";
export default {
  components: { AlertComponent },
  data() {
    return {
      msgStatus: false,
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      defaultForm: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      rules: {
        isValid: true,
        name: [(v) => !!v || "Name is required"],
        email: [
          (v) => !!v || "Email is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        subject: [(v) => !!v || "Subject is required"],
        message: [(v) => !!v || "Messsage is required"],
      },
    };
  },
  computed: {
    //ISLOADING COMPUTED
    isLoading: {
      get: function () {
        return this.$store.state.base.isLoading;
      },
      set: function (newVal) {
        return newVal;
      },
    },
    isError: {
      get: function () {
        return this.$store.state.base.global.status;
      },
      set: function (newVal) {
        return newVal;
      },
    },
  },
  methods: {
    sendemail() {
      this.msgStatus = true;
      this.$store.dispatch("sendEmail", this.form);
      if (this.isError === "Success") {
        this.$refs.form.reset();
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>
<style scoped>
.our-address {
  background-color: #fef08a;
}
.contact {
  background-color: #d1fae5;
}
.contact-info {
  font-size: 16px;
}
.contact-link {
  font-size: 16px;
}
</style>
