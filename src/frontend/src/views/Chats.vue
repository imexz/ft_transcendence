<template>
  <div class="chat-container">
    <div class="room-container">
      <div v-for="room in rooms">
        [{{ room.name }}]: {{ room.text}}
      </div>
    </div>
    <div class="room-input">
      <form @submit.prevent="creat">
        <label>Create Room</label>
        <input v-model="name" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>


<script lang="ts">
// import * as io from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { io } from 'socket.io-client';


export default class ChatsTest extends Vue {


  socket = io('http://localhost:3000')
  rooms = ref([])
  name = ref('')
  id = ref('')


  // setup() {
  //   const count = ref(0)
  //   const socket = io('http://localhost:3000');
  //   const rooms = ref([]);
  //   const name = ref('');
  //   const id = ref('');

  // //   // expose to template and other options API hooks
  // //   return {
  // //     count
  // //   }
  // }


  onBeforeMount(){
    // this.id.value = this.$store.getters.getUser.id;
    this.id.value = "88081"
    this.socket.emit('findAllRooms', {}, (response) => {
      this.rooms.value = response;
    });

  };

  
  mounted() {
    console.log(this.name);
  }


  creat()
  {
    console.log(this.name);

    this.socket.emit('creat', { room_name: this.name, id: this.id }, () => {});
    // this.socket.emit('creat', { }, () => {});
  }
}

</script>

// @import '../assets/base.css';

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
