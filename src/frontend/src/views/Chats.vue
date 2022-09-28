
<template>
  <div>
    <div class="room-input">
      <form @submit.prevent="creat">
        <input v-model="name" />
        <select v-model="access">
          <option>privat</option>
          <option>public</option> 
          <option>protected</option> 
        </select>
        <button type="submit">Create Room</button>
      </form>
    </div>
    <div class="room-container">
        <RoomSummary
        v-for="room in rooms"
          :room = room />
    </div>
    <Toast></Toast>

  </div>

</template>


<script lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import RoomSummary from '../components/Chat/RoomSummary.vue'
import VueAxios from 'axios';
import { API_URL } from '@/models/host';


@Options({
  components : {
    RoomSummary,
  }
})



export default class ChatsTest extends Vue {

  name = ''
  rooms = []
  access = 'public'

  mounted() {
    VueAxios({
        url: '/chatroom/all',
        baseURL: API_URL,
        method: 'GET',
        withCredentials: true,
      })
        .then(response => {
          console.log(response.data);
          
           this.rooms = response.data
          })
        .catch()
  }

  creat()
  {
    console.log("creat");
    console.log(this.access);
    
    VueAxios({
        url: '/chatroom/creat',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
        data: { room_name: this.name, access: this.access}
      })
        .then(response => {
          console.log(response);
          if(response != null)
            this.rooms.push(response.data)
            this.$emit('success', 'creat Room')
            console.log("succes");
          })
        .catch(error => { this.$emit('error') })
  }
}

</script>

<!-- // @import '../assets/base.css'; -->

<style>

.chat{
  padding: flex;
  height: 100vh;  
}

.chat-container {
  display: flex;
  flex-direction: colum;
  height: 100%;
}

.messages-container {
  flex: 1;
}

</style>
