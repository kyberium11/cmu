<template>
  <div>
    <div v-show="!isLoading">
      <div v-show="message.status === 'Error'">
        <div class="errormsg">
          <v-alert
            text
            type="error"
            icon="mdi-alert-circle"
            colored-border
            border="left"
          >
            <v-col class="grow">
              <h3 class="text-warning text-uppercase">{{ message.status }}</h3>
              <strong
                ><h6 class="text-warning text-uppercase">
                  {{ message.message.message }}
                </h6></strong
              >
              <div
              class="text-warning"
                v-for="(item, index) in message.message.errors"
                :key="index.errors"
              >
                <ul v-for="error in item" :key="error.name" class="text-warning">
                  {{
                    error
                  }}
                </ul>
              </div>
            </v-col>
          </v-alert>
        </div>
      </div>
      <div v-show="message.status === 'sww'">
        <div class="errormsg">
          <v-alert
            text
            type="error"
            icon="mdi-alert-circle"
            colored-border
            border="left"
          >
            <v-col class="grow">
              <h3 class="text-warning text-uppercase">Something went wrong!</h3>
              <strong
                ><h6 class="text-warning text-uppercase">
                  {{ message.message.message }}
                </h6></strong
              >
              
              <div
              class="text-warning"
                v-for="(item, index) in message.message.errors"
                :key="index.errors"
              >
              {{item}}
                <ul v-for="(error,i) in item" :key="i" class="text-warning">
                  {{
                    i.item
                  }}
                </ul>
              </div>
            </v-col>
          </v-alert>
        </div>
      </div>
      <div v-show="message.status === 'Success'">
        <div class="successmsg">
          <v-alert
            text
            type="success"
            icon="mdi-check-circle"
            colored-border
            border="left"
          >
            <v-row align="center">
              <v-col class="grow">
                <h3 class="text-success text-uppercase">
                  {{ message.status }}
                </h3>
                <div v-for="(item, i) in message.message" :key="i.sucess">
                  <div
                    class="text-uppercase text-success"
                    v-for="sucess in item"
                    :key="sucess.success"
                  >
                    {{ sucess }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-alert>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    message() {
      return this.$store.state.base.global;
    },
    isLoading() {
      return this.$store.state.base.isLoading;
    },
  },
};
</script>
<style scoped>
.errormsg {
  background-color: #ffd3d3;
}
.successmsg {
  background-color: #e1f3f1;
}
</style>