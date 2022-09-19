<template>
<div class="chat-container">
      <div class="messages-container">
        <div v-for="message in messages">
          [{{ message.name }}]: {{ message.content}}
        </div>
      </div>

      
      <!-- <div v-if="typingDiplay">{{ typingDiplay }}</div> -->
 
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping" />

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </template>
  
  <!-- <button type="submit" @click="emitMessage">Send</button> -->

<script lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Socket } from 'socket.io-client';
import Message from '@/models/message';
import { DefaultEventsMap } from '@socket.io/component-emitter';


@Options ({
  props: {
    socket: Object,
    room_name: Object,
  }
})


export default class Chat extends Vue {
  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  // socket = io(hostURL + ":3000")
  room_name!: string;
  typingDiplay = ref('');
  messageText: string = '';
  messages: Message[] = [];
  timeout: number = 0;


    mounted(){
    console.log("tests");
    
    // this.socket.emit('join', { room_name: this.room_name, user_id: this.user_id}, () => {
    //     // joined.value = true;
    // })
    console.log(this.socket);
    

    // this.socket.emit('findAllMessages', {}, (response) => {
      this.socket.emit('findAllMessages', {room_name: this.room_name}, (response) => {
      console.log(response);
      this.messages = response;
    });

    this.socket.on('message',(message) => {
        this.messages;
    });

    this.socket.on('typing', ({name, isTyping}) => {
        if(isTyping){
            this.typingDiplay.value = "#${name} is typing...";
        } else {
            this.typingDiplay.value = '';
        }
    });
}

// emitMessage() {
//   this.$emit('userSentMessage', this.messageText);
// }


sendMessage() {
  console.log("sendMessage");
  
  this.socket.emit('createMessage', { room_name: this.room_name, content: this.messageText}, () => {
    this.messageText.value = '';
  })
}

emitTyping() {
  this.socket.emit('typing', {isTyping: true, room_name: this.room_name});
  this.timeout = setTimeout(() => {
    this.socket.emit('typing', { isTyping: false});
  }, 2000);
};}


</script>


