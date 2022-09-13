<template>
  <form @submit.prevent="changeUserName">
    <input v-model="newName" placeholder="Enter new Username"/>
    <button>Submit</button>
  </form>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import VueAxios from 'axios';

export default class ChangeUserName extends Vue {
  newName : string = '';
  changeUserName(): void {
    VueAxios({
      url: '/users/update_name',
      baseURL: 'http://localhost:3000',
      method: 'POST',
      withCredentials: true,
      data : { 'name' : this.newName}
    })
      .then(response => {
        console.log(response),
        VueAxios
        .get('http://localhost:3000/users/validate', { withCredentials: true})
        .then(response => (
          this.$store.state.validated = true,
          this.$store.state.user = response.data))
        .catch(error => (this.$store.state.validated = false))})
      .catch(error => { console.log(error)})
  }
}

</script>