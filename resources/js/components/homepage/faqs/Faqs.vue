<template>
  <div class="section section-hero section-shaped">
    <div class="shape shape-style-3 search"></div>
    <div class="page-header">
      <div class="container shape-container align-items-center py-lg">
        <div class="row">
          <h3 class="display-8 text-uppercase">| Frequently Ask Questions</h3>
          <div class="col-md-6" data-aos="zoom-in-right">
              <h5 class="text-uppercase text-green">Faculty and alumnus</h5>
            <v-expansion-panels>
              <v-expansion-panel v-for="(item,i) in extentionPanelFacultyAlumnus" :key="i">
                <v-expansion-panel-header :color="item.qitemBackground"> Question #{{i+1}} </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{item.questionText}}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <div class="col-md-6" data-aos="zoom-in-left">
              <h5 class="text-uppercase text-green">Students</h5>
            <v-expansion-panels>
              <v-expansion-panel v-for="(item,i) in extentionPanelStudents" :key="i">
                <v-expansion-panel-header :color="item.qitemBackground"> Question #{{i+1}} </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{item.questionText}}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </div>
    </div>
    <div class="separator separator-bottom separator-skew zindex-100">
      <svg
        x="0"
        y="0"
        viewBox="0 0 2560 100"
        preserveAspectRatio="none"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
      </svg>
    </div>
  </div>
</template>
<script>
import office from "../../../../../public/assets/img/office/office.png";
export default {
  data() {
    return {
      officeicon: office,
      extentionPanelFacultyAlumnus:[
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Faculty & Alumnus 1'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Faculty & Alumnus 2'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Faculty & Alumnus 3'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Faculty & Alumnus 4'
          }
      ],
      extentionPanelStudents:[
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Students 1'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Students 2'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Students 3'
          },
          {
              qitemBackground:'#e5e8ea',
              questionText:'Question Content Students 4'
          }
      ]

      

    };
  },
};
</script>
<style scoped>
.office-img {
  width: 570px;
  height: 300px;
}
.question-item {
    background-color: ;
}
.search {
  background-color: #fecf14;
}
.content-bg-green {
  background-color: #1e8133;
}
.content-bg-yellow {
  background-color: #fecf14;
}
</style>
