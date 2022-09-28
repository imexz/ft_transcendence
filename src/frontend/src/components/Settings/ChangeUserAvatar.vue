<template>
      <div>
        <form @submit.prevent="ChangeUserAvatar">
          <input type="file" @change="uploadFile">
          <button>Submit</button>
        </form>
        <button @click="deleteFile">Delete</button>
      </div>
</template>
  
  <script lang="ts">
  
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';

  // Delta -> return new url

  export default {
    data () {
      return {
        selectedFile: null,
      }
    },
    methods: {
      ChangeUserAvatar(): void {
        if (this.selectedFile == null) {
          this.$emit('error', 'no file was selected')
        }
        else {
          const fd = new FormData()
          console.log(this.selectedFile.name);
          fd.append('image', this.selectedFile, this.selectedFile.name)
          VueAxios({
            url: '/avatar',
            baseURL: API_URL,
            method: 'POST',
            withCredentials: true,
            data: fd
          })
          .then(response => { this.$emit('success', 'avatar changed')})
          .catch(error => { this.$emit('error', error)})
        }
      },
      uploadFile(event: any) {
          console.log(event);
          this.selectedFile = event.target.files[0]
      },
      deleteFile() {
        VueAxios({
          url: '/avatar',
          baseURL: API_URL,
          method: 'DELETE',
          withCredentials: true,
        })
        .then(response => {
          this.$store.commit('resetAvatar'),
          this.$emit('success', 'avatar was reset')})
        .catch(error => {  this.$emit('error', error) })
      }

  }
  
  </script>
