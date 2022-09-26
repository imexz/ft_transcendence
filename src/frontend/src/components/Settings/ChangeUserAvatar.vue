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
  
  import { Options, Vue } from 'vue-class-component';
  import VueAxios from 'axios';
  import { API_URL } from '@/models/host';
  
  
  export default class ChangeUserAvatar extends Vue {
    newName : string = '';
    selectedFile: any = null;
    ChangeUserAvatar(): void {
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
      .then(response => {
        console.log(response)
        })
      .catch(error => { console.log(error)})
    }
    
    uploadFile(event: any) {
        console.log(event);
        this.selectedFile = event.target.files[0]
    }

    deleteFile() {
      VueAxios({
        url: '/avatar',
        baseURL: API_URL,
        method: 'DELETE',
        withCredentials: true,
      })
      .then(response => {
        this.$store.commit('resetAvatar')})
      .catch(error => { console.log(error)})
    }

  }
  
  </script>
