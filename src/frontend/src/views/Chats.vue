
<template>
  <div>
    <div class="room-input">
      <form @submit.prevent="creat">
        <label>Create Room</label>
        <input v-model="name" />
        <button type="submit">Send</button>
      </form>
    </div>
    <div class="room-container">
        <RoomSummary
        v-for="room in rooms"
          :room = room />
    </div>
    <h1>
      "geht das heir"
    </h1>

  </div>

</template>


<script lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { io } from 'socket.io-client';
import RoomSummary from '../components/Chat/RoomSummary.vue'
import VueAxios from 'axios';


@Options({
  components : {
    RoomSummary,
  }
})


export default class ChatsTest extends Vue {

  name = ''
  rooms = []

  
  mounted() {
    this.$store.getters.getUser.id;
    this.socket = this.$store.getters.getSocket;

  }


  creat()
  {
    console.log("creat");
    VueAxios({
        url: '/users/',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
      })
        .then(response => { this.users = response.data})
        .catch()
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
