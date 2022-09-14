<script lang="ts">
// import { io } from 'socket.io-client';
import * as io from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';

const socket = io('http://localhost:3000');
const rooms = ref([]);
const name = ref('');
const id = ref('')


onBeforeMount(() => {
  this.id = this.$store.getters.getUser.id;
  socket.emit('findAllRooms', {}, (rooms) => {
    rooms.value = rooms;
  });
});


const creat = () =>
{
  socket.emit('creat', { room_name: name.value, id }, () => {})
}

</script>

<template>
  <div class="chat-container">
    <div class="room-container">
      <div v-for="room in rooms">
        [{{ room.name }}]: {{ room.text}}
      </div>
    </div>
    <div class="test">
    <form @submit.prevent="creat">
      <label>Create Room</label>
      <input v-model="name" />
      <button type="submit">Send</button>
    </form>
    </div>
  </div>

</template>

<!-- @import '../assets/base.css'; -->

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
