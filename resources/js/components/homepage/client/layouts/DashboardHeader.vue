<template>
<div>
    <nav class="navbar navbar-top navbar-expand-md page-header" id="navbar-main">
      <div class="container-fluid">
        <!-- Brand -->
        <span class="h4 mb-0 text-black text-uppercase d-none d-lg-inline-block" href="">Digital Archiving System</span>
        <!-- User -->

        <ul class="navbar-nav align-items-center d-none d-md-flex">
          <li class="nav-item dropdown">
            <a class="nav-link pr-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div class="media align-items-center">

                <div class="media-body ml-2 d-none d-lg-block">
                  <span class="mb-0 text-sm text-uppercase text-black font-weight-bold"> {{$store.state.auth.user.name}}</span>
                </div>
                <span class="avatar avatar-sm rounded-circle ml-2">
                  <img :src="userlogo">
                </span>
              </div>
            </a>
            <!-- Account settings drop down -->
            <account-settings/>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Header -->
    <div class="pb-8 pt-5 pt-md-8">
    </div>

</div>

</template>
<script>
/* import user from '../../../../../../public/assets/img/user.png' */
import user from './../../../../../../public/assets/img/user.png'
import AccountSettings from './AccountSettings.vue'
export default {
  components: { AccountSettings },
    data() {
        return {
            userlogo:user
        }
    },

}
</script>
<style scoped>
.navbar-container {
    z-index: 50;
}
.page-header {
  background-color: #21c65e;

}

</style>
