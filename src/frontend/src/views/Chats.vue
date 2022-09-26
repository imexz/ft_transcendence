
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
import RoomSummary from '../components/RoomSummary.vue'


@Options({
  components : {
    RoomSummary,
  }
})


export default class ChatsTest extends Vue {

  rooms = ref([])
  room_name = ref('')
  name = ref('')
  id: number = 0
  socket: any = io
  
      mounted() {
        this.socket = this.$store.getters.getSocket
        this.id = this.$store.getters.getUser.id;
        this.socket.emit('findAllRooms', {id: this.id}, (response: any) => {
        this.rooms = response;
        console.log(response);
        console.log(this.rooms.value);
    });
  }


  creat()
  {
    console.log("creat");
    // this.id.value = 88081
    // console.log(this.$store.getters.getUser.id);

    this.socket.emit('creat', { room_name: this.name, id: this.id }, (response) => {
      this.rooms = response;
      console.log(response);
    });
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
