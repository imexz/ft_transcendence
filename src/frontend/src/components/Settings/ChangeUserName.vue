<template>
  <form @submit.prevent="changeUserName">
    <input v-model="newName" placeholder="Enter new Username"/>
    <button>Submit</button>
  </form>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import VueAxios from 'axios';
import { API_URL } from '@/models/host';

export default class ChangeUserName extends Vue {
  newName : string = '';
  changeUserName(): void {
    VueAxios({
      url: '/users/update_name',
      baseURL: API_URL,
      method: 'POST',
      withCredentials: true,
      data : { 'name' : this.newName }
    })
      .then(response => { this.$store.commit('changeUserName', this.newName) })
      .catch(error => { console.log(error) })
  }
}

</script>