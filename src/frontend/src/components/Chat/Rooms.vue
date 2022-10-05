<template>
    <div  class='parent'>

        <div class='child1'>
            <RoomSummary
            v-for="(room, index) in rooms"
            :room = room @click=update(room.name) 
            :socket = socket />
        </div>
        <!-- <div> {{name}}</div> -->
        <div v-if = "name" class='child2'>
            <Chat   :room_name = name 
                    :socket = socket />
        </div>
    </div>

</template>

<script lang="ts">
import { API_URL } from '@/defines';
import { io } from 'socket.io-client';
import RoomSummary from './RoomSummary.vue'
import Chat from './Chat.vue'
import VueAxios from 'axios';


export default {
        
    data() {
        return {
            name: "",
            rooms: [],
            socket: io
        }
    },
    components: {
        RoomSummary,
        Chat
    },
    methods: {
        getRooms(): void{
            VueAxios({
                url: '/chatroom/all',
                baseURL: API_URL,
                method: 'GET',
                withCredentials: true,
            })
                .then(response => {
                console.log(response.data);
                
                this.rooms = response.data
                })
                .catch()
        },
        computed: {

        },
        update(name: string) {
            console.log(name);
            console.log("update");
            
            this.name = name
        },
        initSocket(): void {
            console.log("mounted CHAT");
            this.socket = io(API_URL, {
                auth: (cb) => {
                    cb({ id: this.$store.getters.getUser._id })
                }
            })
        },
    },
    mounted() {
        this.getRooms();
        this.initSocket();
    }
}

</script>

  <style>
/* .parent {
  border: 1px solid white;
  width: 100%;
} */

.child1 {
    float: left;
    border: 1px solid red;
    width: 40%;
}
.child2 {
    float: right;
    border: 1px solid blue;
    width: 55%;
}

  </style>