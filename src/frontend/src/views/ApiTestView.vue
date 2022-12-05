<template>
  <div class="about">
    <h1>Test API_Calls here</h1>
    <p>{{ method }}</p>
    <form @submit.prevent="handleSubmit">
      <select v-model="method">
        <option>GET</option>
        <option>POST</option> 
      </select>
      <input v-model="url" placeholder="api address">
      <input v-model="body" placeholder="body">
      <br/>
      <button class="defaultElement">Submit</button>
      <br/>
      <h1>Response</h1>
      <p>{{ value }}</p>
    </form>
  </div>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  data () {
    return {
      value: 'empty',
      body: '',
      method: '',
      url: '',
    }
  },
  methods: {
    handleSubmit(): void {
      if (this.body == ''){
        //console.log(this.body)
        VueAxios({
          url: this.url,
          baseURL: API_URL,
          method: this.method,
          withCredentials: true,
        }
        )
        .then(response => { this.value = response.data })
        .catch(error => { this.value = error.response.status})
      }
      else {
        VueAxios({
          url: this.url,
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
})

</script>