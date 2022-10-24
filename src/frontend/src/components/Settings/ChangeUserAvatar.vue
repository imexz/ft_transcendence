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
// Delta -> return new url

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