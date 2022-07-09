<template>
  <div class="mt-n1 notfound-container">
    <!-- <v-container>
            <div class="row mt-15">
                <div class="text-center mt-20">
                    <img :src="notfound" class="notfound">
                </div>
                <div class="text-center">
                    <v-btn @click="$router.go(-1)" dark color="info">
                        Return to page
                    </v-btn>
                </div>
                    
                    
            </div>
            
        </v-container> -->
    <v-row class="align-center" justify="center">
      <v-col cols="12" md="4" sm="10">
        <div class="float-right">
          <v-layout row justify-center align-center class="mt-14">
            <v-card outlined height="450px" :color="bgvcard">
                <v-card-title>
                    <h1 class="text-uppercase">Page not found.</h1>
                </v-card-title>
              <v-card-text>
                <p>
                  Sorry, the page you are looking for doesn't exist<br>
                  or has been removed. Here some helful link.
                </p>
              </v-card-text>
              <!-- Form Buttons -->

              <v-card-actions>
                   <v-btn text @click="redirectBack"><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
                  <v-btn color="success" dark @click="redirectToHome"><v-icon>mdi-home</v-icon>Take me home</v-btn>
            </v-card-actions>
            </v-card>
          </v-layout>
        </div>
      </v-col>
      <v-col cols="12" md="8" sm="10" class="right-container">
        <img :src="notfound" class="mt-5" height="90%" width="100%" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import notfound from "./../../../public/images/404v2.svg";
export default {
  data() {
    return {
        bgvcard:'#d9effa',
      notfound: notfound,
    };
  },
  methods:{
      redirectBack() {
          this.$router.go(-1)
      },
      redirectToHome() {
          this.$router.push({
              name:'homepage'
          })
      }
  }
};
</script>
<style scoped>
.right-container {
  height: 100vh;
}
.notfound-container {
  background-color: #d9effa;
  height: 100%;
}
</style>
