
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
      <!-- [{{ room.id }}]: {{ room.name}} -->
    <!-- <div v-if=room_name class="test">
      <Chat
        :socket = socket
        :room_name = room_name.value />     
    </div> -->
    <h1>
      "geht das heir"
    </h1>

  </div>

</template>


<script lang="ts">
// import * as io from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { io } from 'socket.io-client';
// import { hostURL } from '@/models/host';
import RoomSummary from '../components/RoomSummary.vue'


@Options({
  components : {
    RoomSummary,
  }
})


export default class ChatsTest extends Vue {

  // socket = socket
  rooms = ref([])
  room_name = ref('')
  name = ref('')
  id: number = 0
  socket: io
  
  
  
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
      
      
      beforeMount(){
        // console.log(this.$store.getters.getUser);
        
        
        
        // this.id = this.$store.getters.getUser.id;
      };
      
      mounted() {
        this.socket = this.$store.getters.getSocket
        this.id = this.$store.getters.getUser.id;
        // this.id.value = 88081
        this.socket.emit('findAllRooms', {id: this.id}, (response) => {
        this.rooms = response;
        console.log(response);
        console.log(this.rooms.value);
    });
    // console.log(this.name);
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
