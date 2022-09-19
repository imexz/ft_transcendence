<template>
<div class="chat-container">
      <div class="messages-container">
        <div v-for="message in messages">
          [{{ message.name }}]: {{ message.text}}
        </div>
      </div>

      


      <div v-if="typingDiplay">{{ typingDiplay }}</div>
      <hr />
 
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping" />

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
</template>


<script lang="ts">
// import { onBeforeMount, ref } from 'vue';
// import { Options, Vue } from 'vue-class-component';
// import { io } from 'socket.io-client';


// @Options ({
//   props: {
//     socket: Object,
//     room_name: Object,
//   }
// })


// export default class Chat extends Vue {
//   socket: any
//   room_name!: string;
//   typingDiplay = ref('');
//   messageText = ref('');
//   messages = ref([]);



// onBeforeMount(){
//     this.socket.emit('join', { room_name: this.room_name, user_id: user_id}, () => {
//         // joined.value = true;
//     })

//     this.socket.emit('findAllMessages', {this.room_name}, (response) => {
//         messages.value = response;
//     });

//     this.socket.on('message', (message) => {
//         messages.value.push(message);
//     });

//     this.socket.on('typing', ({name, isTyping}) => {
//         if(isTyping){
//             typingDiplay.value = "${name} is typing...";
//         } else {
//             typingDiplay.value = '';
//         }
//     });
// }


// const sendMessage = () => {
//   socket.emit('createMessage', { text: messageText.value}, () => {
//     messageText.value = '';
//   })
// }

// let timeout;
// const emitTyping = () => {
//   socket.emit('typing', {isTyping: true});
//   timeout = setTimeout(() => {
//     socket.emit('typing', { isTyping: false});
//   }, 2000);
// };}



</script setup>


