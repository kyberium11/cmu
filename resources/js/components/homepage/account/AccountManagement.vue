<template>
    <div>
    <section class="section section-shaped" v-show="!auth.authenticated" v-cloak>
    <div class="container pt-lg-7 pb-lg-7">
          <div v-show="actionType === 'Login'">
            <login @type="getRegister"/>
          </div>
          <div v-show="actionType === 'Register'">
            <register @type="getLogin"/>
          </div>
    </div>
  </section>
    </div>
</template>
<script>
import Register from './Register.vue'
import Login from './Login.vue'
import authimg from './../../../../../public/images/authentication.svg'
export default {
  components:{Register,Login},
  data() {
    return {
      actionType:'Login',
      authimg:authimg
    }
  },
  computed:{
    auth() {
      return this.$store.state.auth
    }
  },
  methods: {
    getRegister(register) {
      this.actionType = register
    },
    getLogin(login) {
      this.actionType = login
    }
  }
}
</script>
<style scoped>
[v-cloak] {
  display: none;
}
</style>