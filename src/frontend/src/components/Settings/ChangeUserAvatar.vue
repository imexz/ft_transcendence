<template>
  <div class="wrapper">
    <div>
      <button v-if="selectedFile === null" class="btnupload" @click="($refs.file as any).click()">Select File</button>
      <button v-else class="btnupload" @click="($refs.file as any).click()">{{ selectedFile.name }}</button>
      <button @click="ChangeUserAvatar">Upload</button>
    </div>
    <div>
      <button @click="deleteFile">Restore Default</button>
    </div>
  </div>
  <input ref="file" type="file" class="d-none" @change="uploadFile"/>
</template>

<script lang="ts">

import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
  data () {
    return {
      selectedFile: null as File | null,
    }
  },
  emits: {
    error: null,
    success: null,
  },
  methods: {
    ChangeUserAvatar(): void {
      if (this.selectedFile == null) {
        this.$emit('error', 'no file was selected')
      }
      else if (this.selectedFile.type != 'image/jpeg') {
        this.$emit('error', 'wrong file type')
      }
      else if (this.selectedFile.size > 5242880) {
        this.$emit('error', 'file to big')
      }
      else {
        const fd = new FormData()
        fd.append('image', this.selectedFile, this.selectedFile.name)
        VueAxios({
          url: '/avatar',
          baseURL: API_URL,
          method: 'POST',
          withCredentials: true,
          data: fd
        })
        .then(response => {
          this.$emit('success', 'avatar changed')
          //console.log("AAABBB", response.data);
          if (response.data.includes('cdn.intra.42.fr'))
            this.$store.state.user.avatar_url = API_URL + response.data
          else
          {
            let date : Date = new Date()
            this.$store.state.user.avatar_url = API_URL + response.data + "?nocache=" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds()
          }
          //console.log("done");
        })

        .catch(error => {
          this.$emit('error', 'Could not change Avatar')
          //console.log(error);
        })
      }
    },
    uploadFile(event: any) {
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
        this.$store.state.user.avatar_url = response.data
        this.$emit('success', 'avatar was reset')})
      .catch(error => { this.$emit('error', 'Could not restore Default') })
    }
  }
})

</script>


<style scoped>

  .d-none {
    display: none;
  }
  .wrapper {
    display: flex;
    justify-content: space-between;
  }


</style>