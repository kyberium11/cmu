<template>
  <div>
    <div class="section section-hero section-shaped">
      <div class="page-header">
        <div class="container shape-container align-items-center py-lg">
          <div class="row">
            
            <div class="col-md-6 mt-15">
                <div class="col-lg-12">
                  <div
                    data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine"
                  >
                    <h6 class="display-8 title">Central Mindanao University</h6>
                  </div>
                  <div
                    data-aos="fade-left"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine"
                  >
                    <h3 class="display-6 subtitle">Digital Archiving System</h3>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="3000">
                    <p
                      class="
                        font-weight-normal
                        text-black
                        animate__animated animate__fadeIn
                      "
                    >
                      <span class="sub-text">Students</span>
                      ,<span class="sub-text">Faculty</span> and
                      <span class="sub-text">Alumnus</span>
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididun t ut labore et dolore
                    </p>

                    <v-list dense>
                      <v-list-item v-for="(item,i) in items" :key="i">

                        <v-list-item-icon class="mt-3">
                          <v-icon v-text="item.icon" color="success"></v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                          class="mt-n2"
                            v-text="item.text"
                          ></v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-avatar>
                          <v-img :src="item.avatar"></v-img>
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>


            </div>
            <div class="col-md-6">
              <img :src="personalfiles" height="85%" />
            </div>

            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.home {
  background-image: url("../../../../../public/assets/img/banner2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.sub-text {
  color: #21c65e;
}
.btn-bg-green {
  background-color: #21c65e;
}
.btn-bg-yellow {
  background-color: #fecf14;
}
.bg-green {
  background: linear-gradient(150deg, #2dce89 15%, #21c65e 70%, #21c65e 94%);
  opacity: 0.3;
}
.bg-yellow {
  background: linear-gradient(150deg, #d4eb0d 15%, #ddbd0a 70%, #ddc409 94%);
  opacity: 0.3;
}
.title {
  color: #fecf14;
  text-transform: uppercase;
  font-size: 3.5rem;
  font-weight: bold;
  -webkit-text-stroke: 2px #21c65e;
  -webkit-text-fill-color: #fecf14;
}
.subtitle {
  color: #21c65e;
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: bold;
  color: #000000;
}
.office-img {
  width: 450px;
  height: 250px;
}
.personalfiles {
  width: 100%;
  height: 80%;
}
</style>
<script>

import Login from "./../account/Login.vue";
import Register from "./../account/Register.vue";
import office from "../../../../../public/assets/img/office/office.png";
import personalfiles from "../../../../../public/images/personalfiles.svg";
export default {
  components: {
    Login,
    Register,
  },
  data() {
    return {
      officeicon: office,
      personalfiles: personalfiles,
      selectedItem: 1,
      lockSelection: true,
      inactiveClass: true,
      items: [
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          title: "Jason Oner",
          icon: "mdi-circle-double",
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          title: "Travis Howard",
          icon: "mdi-circle-double",
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          title: "Ali Connors",
          icon: "mdi-circle-double",
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          title: "Cindy Baker",
          icon: "mdi-circle-double",
        },
      ],
      /* items: [
        { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', icon: 'mdi-circle-double',disabled:'disabled'},
        { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', icon: 'mdi-circle-double',disabled:'disabled'},
        { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', icon: 'mdi-circle-double',disabled:'disabled'},
      ], */
    };
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },
  },
};
</script>

