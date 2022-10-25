<template>
    <div @click="resetNumber">
        <span>{{room.roomName}}</span>
        <button @click="switchState" > {{button_text}}</button>
        <span> {{ number }}</span>
    </div>
</template>
    <!-- @userSentMessage="emitMessageToServer" -->

<script lang="ts">

import Room from '@/models/room';
import Chat from '@/components/Chat/Chat.vue';
import { Options, Vue } from 'vue-class-component';
// import { Socket } from 'socket.io-client';
import room from '@/models/room';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import Message from '@/models/message';

  export default {
    data(): unknown {
      return {
        joined: false,
        button_text: "join",
        number: 0
      }

    },
    components: {
      Chat,
    },
    props: {
      socket: Object,
      room: Room
    },
    methods: {
      switchState(): void {
        this.joined = !this.joined;
        this.button_text = (this.joined) ? "leaf" : "join";
        if(this.joined) {
          this.socket.emit('join', {room_name: this.room.name}, () => {

          })
        } else {
          this.socket.emit('leave', {room_name: this.room.name}, () => {

          })
        }
      },
      resetNumber(): void
      {
        this.number = 0
      }
    },
    mounted() {
      this.socket.on('message', (message) => {
        this.number++
      })
    }
  }

</script>

<style scoped>
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      vertical-align: middle;
      padding: 10px;
      display: inline-block;
    }
    span {
      vertical-align: middle;
      /* padding: 50px; */
      display: inline-block;
      font-size: 30px;
      width: 200px;
    }
    div {
      text-align: left;
      /* border: 5px solid; */
      border-image-slice: 1;
      border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
    }
    button {
      vertical-align: middle;
    }
  </style>

