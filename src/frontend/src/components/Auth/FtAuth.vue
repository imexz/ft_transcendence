<template>
  <div>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div v-if="!this.$store.getters.isLogged">
      <button 
        class="authButton"
        @click="this.authenticate">login</button>
        
    </div>
    <div v-else>
      <button
        class="authButton"
        @click="this.logout">logout</button>
    </div>
  </div>
</template>

<script lang="ts">
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';
  import EnableTwoFA from '@/components/Auth/enable2fc.vue';
  import Toast from '@/components/Toast.vue'
  import { ref }  from 'vue';


export default {
  components: {
    EnableTwoFA,
    Toast,
  },
  data() {
    return {
      showToast : ref(false),
      toastMsg : ref(''),
      toastMode : ref(''),
    }
  },
  methods: {
    logout(): void {
        this.$store.dispatch('logOut');
        this.$router.push('/login');
        VueAxios({
            url: '/users/logout',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
    },
    authenticate() {
      location.href= API_URL + '/auth/login'
    },
    triggerToast(msg: string, mode: string) {
        this.showToast = true;
        this.toastMsg = msg;
        this.toastMode = mode;
        setTimeout(() => this.showToast = false, 2000);
    },
    validateUser() {
        VueAxios({
          url: '/users/validate',
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
        .then(response => (
          this.$store.dispatch('logIn', response.data),
          this.triggerToast('vaildated', 'success')))
        .catch(error => (
          console.log(error),
          this.$store.commit('logOut'),
          this.triggerToast('please log in', 'error')))
    }
  },
  mounted(): void {
    this.validateUser()
  }
}

</script>

<style>
  .authButton {
    text-decoration: none;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    color: var(--ft_white);
    background:  linear-gradient(var(--ft_red), var(--ft_yellow));
    padding: 14px 24px;
    border-radius: 10px;
  }
  .authButton:active{
    transform: translateY(1px);
  }
</style>