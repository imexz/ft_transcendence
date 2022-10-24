<template>
<div class="chat-container">
      <div>
        <div v-if="room_name" v-for="message in messages">
          <Message :message = message />
    

        </div>
       </div>

        <div v-if="typingDiplay">{{ typingDiplay }}</div>
 
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping" />
          <!-- <input v-model="messageText" /> -->
          <button type="submit">Send</button>
        </form>
    </div>
</template>
  
  <!-- <button type="submit" @click="emitMessage">Send</button> -->

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { io } from 'socket.io-client';
import { API_URL } from '@/defines';
import Message from './Message.vue';
import { ref, Ref } from 'vue'
import { defineComponent  } from 'vue';

export default defineComponent({

  data(): unknown {
    return {
      typingDiplay: '',
      messageText: '',
      messages: [],
      timeout: 0,
      user_id: 0 as Number,
    }
  },
  props: {
    room_name: String,
    socket: io,
  },
  watch: {
    room_name(newRome_name, oldRome_name) {
      if(newRome_name != oldRome_name)
      {
        this.updateMessages()
      }
    }

  },
  methods: {

    
    async updateMessages() {
      this.socket.emit('findAllMessages', {room_name: this.room_name}, (response: any) => {
        console.log(response);
        this.messages = response;
      })
    },
    sendMessage() {
      console.log("sendMessage");
      this.socket.emit('createMessage', { room_name: this.room_name, content: this.messageText}, (response) =>
      {
        console.log(response);
        this.messages.push(response)
        
        this.messageText = '';
      })
    },
    emitTyping() {
      this.socket.emit('typing', {isTyping: true, room_name: this.room_name});
      this.timeout = setTimeout(() => {
        this.socket.emit('typing', { isTyping: false, room_name: this.room_name});
      }, 2000);
      console.log("emit typing ");
      console.log(this.room_name);
      
    }
  },
  components: {
    Message
  },
  mounted() {
    this.user_id = this.$store.getters.getUser._id
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
    this.updateMessages()
  },
  beforeMount(){
    console.log("beforeMounted");
  }
})

</script>



