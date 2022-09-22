<template>
      <div>
        <input type="file" @change="uploadFile">
        <button @click="ChangeUserAvatar">Upload!</button>
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
      // VueAxios({
      //   url: '/avatar',
      //   baseURL: hostURL + ':3000',
      //   method: 'POST',
      //   withCredentials: true,
      //   data : { 'name' : this.newName}
      // })
      const fd = new FormData()
      fd.append('image', this.selectedFile, this.selectedFile.name)
      axios.post(hostURL + ':3000' + '/avatar', fd, 
      {
        onUploadProgress: uploadEvent => {
          console.log('Uplad Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + "%")
        }
      }
      )
      .then(res => {
        console.log(res)
      })
    }
    uploadFile(event ) {
        console.log(event);
        this.selectedFile = event.target.files[0]
        
    }

  }
  
  </script>
