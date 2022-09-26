<template>
<div class="chat-container">
      <div class="messages-container">
        <div v-for="message in messages">
          [{{ message.user.unique_name }}]: {{ message.content}}
        </div>
      </div>

      <div>
        <div v-if="typingDiplay">{{ typingDiplay }}</div>
        <hr />
      </div>
 
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping" />
          <!-- <input v-model="messageText" /> -->
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </template>
  
  <!-- <button type="submit" @click="emitMessage">Send</button> -->

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Socket } from 'socket.io-client';
import Message from '@/models/message';

@Options ({
  props: {
    // socket: Object,
    room_name: Object,
  }
})


export default class Chat extends Vue {
  // socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  // socket = socket
  // socket = io(hostURL + ":3000")
  room_name!: string;
  typingDiplay = '';
  messageText: string = '';
  messages: Message[] = [];
  timeout: number = 0;
  socket!: Socket;
  user_id!: Number;
  
  
  mounted(){
    this.socket = this.$store.getters.getSocket
    this.user_id = this.$store.getters.getUser.user_id
    console.log("tests");
    // console.log(this.$socketio.id);     
    // console.log(this.$socketchat.id);
    
    this.socket.emit('join', { room_name: this.room_name, user_id: this.user_id}, () => {
        // joined.value = true;
    })
    // console.log(this.socket);
    

    // this.socket.emit('findAllMessages', {}, (response) => {
    this.socket.emit('findAllMessages', {room_name: this.room_name}, (response: any) => {
      console.log(response);
      this.messages = response;
    });

    this.socket.on('message',(message) => {
      console.log('message');
      console.log(message);
      this.messages.push(message);
    });




    this.socket.on('typing', ({name, isTyping}) => {
      console.log("recive typing");
      console.log(name);
      console.log(isTyping);
      
      
      
        if(isTyping){
            this.typingDiplay = name + " is typing...";
        } else {
            this.typingDiplay = '';
        }
    });

    this.socket.on('successfullConnected', () => {
        console.log("recive successfullConnected");
        
    });
  }
  
  unmounted() {
    console.log("unmounted");
    
    this.socket.emit('leave', () => {
        console.log("leave");
        
    });
  }



// emitMessage() {
//   this.$emit('userSentMessage', this.messageText);
// }


sendMessage() {
  console.log("sendMessage");
  this.socket.emit('createMessage', { room_name: this.room_name, content: this.messageText}, (response) =>
  {
    console.log(response);
    this.messages.push(response)
    
    this.messageText = '';
  })
}

emitTyping() {
  this.socket.emit('typing', {isTyping: true, room_name: this.room_name});
  this.timeout = setTimeout(() => {
    this.socket.emit('typing', { isTyping: false, room_name: this.room_name});
  }, 2000);
  console.log("emit typing ");
  console.log(this.room_name);
  
};}


</script>


