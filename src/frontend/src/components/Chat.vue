<template>
<div class="chat-container" v-else>
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


<script setup>

export default {
  props: ['room_name'],
  props: ['socket'],
  props: ['user_id']
}

const typingDiplay = ref('');
const messageText = ref('');
const messages = ref([]);



onBeforeMount(() => {
    socket.emit('join', { room_name: room_name, user_id: user_id}, () => {
        // joined.value = true;
    })

    socket.emit('findAllMessages', {room_name}, (response) => {
        messages.value = response;
    });

    socket.on('message', (message) => {
        messages.value.push(message);
    });

    socket.on('typing', ({name, isTyping}) => {
        if(isTyping){
            typingDiplay.value = "${name} is typing...";
        } else {
            typingDiplay.value = '';
        }
    });
}


const sendMessage = () => {
  socket.emit('createMessage', { text: messageText.value}, () => {
    messageText.value = '';
  })
}

let timeout;
const emitTyping = () => {
  socket.emit('typing', {isTyping: true});
  timeout = setTimeout(() => {
    socket.emit('typing', { isTyping: false});
  }, 2000);
};



</script setup>


