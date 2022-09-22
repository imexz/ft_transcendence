<template>
      <!-- <div>
        <input type="file" @change="uploadFile">
        <button @click="ChangeUserAvatar">Upload!</button>
      </div> -->
      <div>
        <form @submit.prevent="ChangeUserAvatar">
          <input type="file" @change="uploadFile">
          <button>Submit</button>
        </form>
        <button @click="deleteFile">Delete</button>
      </div>


</template>
  
  <script lang="ts">
  
  import { Options, Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import { hostURL } from '@/models/host';
  import axios from 'axios';
  
  export default class ChangeUserAvatar extends Vue {
    newName : string = '';
    selectedFile: any = null;
    ChangeUserAvatar(): void {
      const fd = new FormData()
      console.log(this.selectedFile.name);
      fd.append('image', this.selectedFile, this.selectedFile.name)
      VueAxios({
        url: '/avatar',
        baseURL: hostURL + ':3000',
        method: 'POST',
        withCredentials: true,
        data: fd
      })
      .then(response => {
        console.log(response),
        VueAxios({
          url: '/users/validate',
          baseURL: hostURL + ':3000',
          method: 'GET',
          withCredentials: true,
        })
        .then(response => (
          this.$store.state.validated = true,
          this.$store.state.user = response.data))
        .catch(error => (this.$store.state.validated = false))})
      .catch(error => { console.log(error)})
    }
    
    uploadFile(event) {
        console.log(event);
        this.selectedFile = event.target.files[0]
    }

    deleteFile() {
      VueAxios({
        url: '/avatar',
        baseURL: hostURL + ':3000',
        method: 'DELETE',
        withCredentials: true,
      })
      .then(response => {
        console.log(response),
        VueAxios({
          url: '/users/validate',
          baseURL: hostURL + ':3000',
          method: 'GET',
          withCredentials: true,
        })
        .then(response => (
          this.$store.state.validated = true,
          this.$store.state.user = response.data))
        .catch(error => (this.$store.state.validated = false))})
      .catch(error => { console.log(error)})
    }

  }
  
  </script>
