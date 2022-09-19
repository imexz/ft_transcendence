<template>
  <div class="about">
    <h1>Test API_Calls here</h1>
    <p>{{ method }}</p>
    <form @submit.prevent="handleSubmit">
      <select v-model="method">
        <option>GET</option>
        <option>POST</option> 
      </select>
      <input v-model="text" placeholder="api address">
      <input v-model="body" placeholder="body">
      <br/>
      <button>Submit</button>
      <br/>
      <h1>Response</h1>
      <p>{{ value }}</p>
    </form>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';

  export default class ApiTest extends Vue {
    beforCreate(): void {
      if (!this.$store.getters.isLogged) {
        this.$router.push({ name: 'login'})
      }
    }
    value = 'empty'
    body = ''
    method !: string 
    text!: string
    handleSubmit(): void {
      if (this.body == ''){
        console.log(this.body)
        VueAxios({
          url: this.text,
          baseURL: API_URL,
          method: this.method,
          withCredentials: true,
          // data : JSON.parse(this.body)
        }
        )
        .then(response => { this.value = response.data })
        .catch(error => { this.value = error.response.status})
      }
      else {
        VueAxios({
          url: this.text,
          baseURL: API_URL,
          method: this.method,
          withCredentials: true,
          data : JSON.parse(this.body)
        }
      )
        .then(response => { this.value = response.data })
        .catch(error => { this.value = error.response.status})
      }
    }
  }
</script>