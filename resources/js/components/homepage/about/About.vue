<template>
  <div class="section features-6 about-content">
    
    <div class="container">
      
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="info-horizontal">
            <h3 class="display-8 text-uppercase">| About Us</h3>
            <div
              class="description pl-4 text-black p-3"
              data-aos="zoom-in-right"
            >
            
              <p class="p-about">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est
                laborum."<br /><br />
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum."
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-10 mx-md-auto" data-aos="zoom-in-left">
          <div class="row">
            <div class="col-md-12">
              <v-card class="mx-auto archives-mission" :color="archives_mission" elevation="2" outlined shaped tile>
                <v-card-title class="text-uppercase text-green">Archives Mission</v-card-title>
                <v-card-text>
                  
                  <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum."<br /><br />
                  </p>
                </v-card-text>
              </v-card>
            </div>

            <div class="col-md-12 mt-5">
             <v-card class="mx-auto" elevation="2" :color="rmu_mission" outlined shaped tile>
                <v-card-title class="text-uppercase text-green">Mission of the RMU</v-card-title>
                <v-card-text>
                  
                  <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum."<br /><br />
                  </p>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import about from "../../../../../public/assets/img/about2.png";
export default {
  data() {
    return {
      about: about,
      archives_mission:'#d1fae5',
      rmu_mission:'#fef08a',
      cardTitle:'#1e8133'
    };
  },
};
</script>
<style scoped>
.p-about {
  text-indent: 50px;
  line-height: 2;
}
.archives-mission {
  background-color:#d1fae5;
}
.mission-rmu {
  background-color: #fef08a;
}
.about-content {
  height: 100%;
}
.content-bg-green {
  background-color: #1e8133;
}
.content-bg-yellow {
  background-color: #fecf14;
}
</style>
