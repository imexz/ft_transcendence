
<template>
  <div>
    <div class="room-input">
      <form @submit.prevent="creat">
        <label>Create Room</label>
        <input v-model="name" />
        <select name="cars" id="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
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
import { API_URL } from '@/models/host';

Vue.component("v-select", vSelect);


@Options({
  components : {
    RoomSummary,
  }
})


export default class ChatsTest extends Vue {

  name = ''
  rooms = []
  access = ''

  
  mounted() {
    this.$store.getters.getUser.id;

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
