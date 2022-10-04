<template>
  <form @submit.prevent="changeUserName">
    <input v-model="newName" placeholder="Enter new Username"/>
    <button>Submit</button>
  </form>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { ref } from 'vue';
import { maxLenUserName, API_URL} from '@/defines';

export default {
  data() {
    return {
      newName : ref(''),
    }
  },
  methods: {
    changeUserName(): void {
      console.log(this.newName.length, maxLenUserName)
      if (this.newName === ''){
        this.$emit('error', 'Empty Name')
      }
      else if (this.newName.length > maxLenUserName){
        this.$emit('error', 'Name to long')
      }
      else {
          VueAxios({
            url: '/users/update_name',
            baseURL: API_URL,
            method: 'POST',
            withCredentials: true,
            data : { 'name' : this.newName }
          })
            .then(response => {
              this.$emit('success', 'name changed'),
              this.$store.commit('changeUserName', this.newName)
            })
            .catch(error => { this.$emit('error') })
        }
    }
  }
}

</script>