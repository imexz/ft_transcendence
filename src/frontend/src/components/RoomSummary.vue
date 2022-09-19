<template>
    <div>
        <span>{{room.name}}</span>
        <button @click="switchState" > {{button_text}}</button>
        <!-- <span>{{joined}}</span> -->
        <div v-if=joined class="test">
          <Chat
          :socket = socket
          :room_name = room.name />     
        </div>
      </div>
    </template>
    <!-- @userSentMessage="emitMessageToServer" -->

<script lang="ts">

import Room from '@/models/room';
import Chat from '@/components/Chat.vue';
import { Options, Vue } from 'vue-class-component';
import { Socket } from 'socket.io-client';
import room from '@/models/room';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { SocketContext } from '../context/socket';

    @Options ({
      components: {
        Chat,
      },
      props: {
        // socket: Object,
        room: Room
      }
    })

    export default class RoomSummary extends Vue {

        joined = false; 
        button_text = "join";  
        room!: Room;
        // socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
        socket = useContext(SocketContext);


        // mounted() {
        //   this.button_text = this.switchState();  
        // }

        switchState(): void {
          this.joined = !this.joined;
          this.button_text = (this.joined) ? "leaf" : "join";
        }

        // emitMessageToServer(value) {

        // }
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
      border: 5px solid;
      border-image-slice: 1;
      border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
    }
    button {
      vertical-align: middle;
    }
  </style>

