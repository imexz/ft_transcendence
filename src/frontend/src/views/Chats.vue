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
        <!-- [{{ room.id }}]: {{ room.name}} -->
    </div>
    <div class="room-container">
      <RoomSummary
      v-for="room in rooms"
        :room = room />
        <!-- [{{ room.id }}]: {{ room.name}} -->
    </div>

  </div>
</template>


<script lang="ts">
// import * as io from 'socket.io-client';
// import { onBeforeMount, ref } from 'vue';
// import { Options, Vue } from 'vue-class-component';
// import { io } from 'socket.io-client';
// import { API_URL } from '@/models/host';
// import RoomSummary from '../components/RoomSummary.vue'

// @Options({
//   components : {
//     RoomSummary,
//   }
// })


// export default class ChatsTest extends Vue {
//   socket = io(API_URL)
//   rooms = ref([])
//   name = ref('')
//   id: number = 0


//   // setup() {
//   //   const count = ref(0)
//   //   const socket = io('http://localhost:3000');
//   //   const rooms = ref([]);
//   //   const name = ref('');
//   //   const id = ref('');

//   // //   // expose to template and other options API hooks
//   // //   return {
//   // //     count
//   // //   }
//   // }


//   beforeMount(){
//     // console.log(this.$store.getters.getUser);
    
//     // this.id.value = this.$store.getters.getUser.id;
//     // this.id.value = 88081
//       this.socket.emit('findAllRooms', {}, (response: any) => {
//       this.rooms = response;
//       console.log(response);
//       console.log(this.rooms.value);
//     });

//   };

  
//   mounted() {
//     // console.log(this.name);
//     this.id = this.$store.getters.getUser.id;
//   }


//   creat()
//   {
//     console.log(this.name);
//     // this.id.value = 88081
//     // console.log(this.$store.getters.getUser.id);

//     this.socket.emit('creat', { room_name: this.name, id: this.id }, (response) => {
//       this.rooms = response;
//       console.log(response);
//     });
//   }
// }

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
