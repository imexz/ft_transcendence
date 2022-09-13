<template>
  <div class="about">
    <h1>Test API_Calls here</h1>
    <form @submit.prevent="handleSubmit">
      <select v-model="method">
        <option>GET</option>
        <option>POST</option> 
      </select>
      <input v-model="text" placeholder="api address">
      <button>Submit</button>
      <br/>
      <h1>Response</h1>
      <p>{{ value }}</p>
    </form>
  </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-class-component';
  import VueAxios from 'axios';

  export default class ApiTest extends Vue {
    value = 'empty'
    method !: string 
    text!: string
    handleSubmit(): void {
      VueAxios({
          url: this.text,
          baseURL: 'http://localhost:3000',
          method: this.method,
          withCredentials: true,
        }
      )
        .then(response => { this.value = response.data })
        .catch(error => { this.value = error.response.status})
    }
  }
</script>