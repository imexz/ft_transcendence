<template>
  <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      @send-message="sendMessage($event.detail[0])"
      @add-room="makePopupCreate()"
      @room-action-handler="roomActionHandler($event.detail[0])"
      @typing-message="emitTyping($event.detail[0])"
      @fetch-messages="putMessages($event.detail[0])"
    >
    <!-- <div slot="room-list-item_1">
      This is a new room header
    </div> -->
  </vue-advanced-chat>
    <creatRoomPopup
      v-if="PoppupCreate"
      :TogglePopup="() => makePopupCreate()" >
      <h2>Creat Room</h2>
    </creatRoomPopup>

    <!-- <joinRoomPopup
      v-if="PoppupJoin"
      :TogglePopup="() => makePopupJoin()"
      :password="password"
      :roomId="">
      <h2>Join Room</h2>
    </joinRoomPopup> -->
  </template>
  
  <script >
  import { register } from 'vue-advanced-chat'
  import { io, Socket } from 'socket.io-client';
  import { ref } from 'vue';
  import VueAxios from 'axios';
  import { API_URL } from '@/defines';
  import creatRoomPopup from '@/components/Chat/creatRoomPopup.vue';
  import joinRoomPopup from '@/components/Chat/joinRoomPopup.vue';


  register()
  
    export default {
      data() {
        return {
          currentUserId: '',
          currentRoomId: '',
          rooms: [],
          messages: [],
          roomActions: [
            { name: 'join', title: 'join Room' },
            { name: 'leave', title: 'leave Room' },
            { name: 'deleteRoom', title: 'Delete Room' }
          ],
          PoppupCreate: ref(false),
          PoppupJoin: ref(false),
          password: '',
          timeout: 0,
          typing: false,
  		    socket: null
        }
      },
      components:{
        creatRoomPopup,
        joinRoomPopup
      },
      methods: {
        async putMessages({room}) {
          console.log("putMessages");
          this.currentRoomId = room.roomId
          this.updateMessages(room.roomId)
        },

        async updateMessages(roomId) {
          console.log("updateMessages");
          console.log(roomId);
          this.socket.emit('findAllMessages', {roomId: roomId}, (response) => {
            console.log(response);
            this.messages = response;
          })
        },
        sendMessage({ roomId, content, files, replyMessage, usersTag }) {
          console.log("createMessage");
          console.log(roomId);
          this.socket.emit('createMessage', { roomId: roomId, content: content}, (response) =>
          {
            console.log("createMessage response");
            console.log(response);
            this.addMessage(response)
          })
        },
        makePopupCreate() {
          console.log("makePopupCreate");
          this.PoppupCreate = !this.PoppupCreate
          if (this.PoppupCreate == false) {
            this.getRooms()
            this.initSocket()
          }
          console.log(this.PoppupCreate);
        },
        makePopupJoin(roomId) {
          console.log("makePopupJoin");
          console.log(roomId)
          this.PoppupJoin = !this.PoppupJoin
          if (this.PoppupJoin == false) {
            this.$store.state.socket.emit('join', {roomId: roomId, password: this.password})
          }
          console.log(this.PoppupJoin);
        },
        creatRoom(){
            VueAxios({
                url: '/chatroom/creat',
                baseURL: API_URL,
                method: 'POST',
                withCredentials: true,
                data: { room_name: "test", access: "public"}
            })
                .then(response => {
                  console.log(response);
                  if(response != null) {
                    const rooms = []
                    for (let i = 0; i < response.length; i++) {
                      rooms.push(response)
                    }
                    this.rooms = rooms
                    this.$emit('success', 'creat Room')
                    console.log("succes");
                  }
                })
                .catch(error => { this.$emit('error') })
        },
      
        emitTyping({ roomId, message }) {
          console.log("emitTyping");
          console.log(roomId);
          console.log(this.timeout);
          if(this.typing == false)
          {
            this.socket.emit('typing', {isTyping: true, roomId: roomId});
            this.typing = true
          
            this.timeout = setTimeout(() => {
              if(this.typing == true) {
                this.socket.emit('typing', { isTyping: false, roomId: roomId});
                this.typing = false
              }
            }, 2000);
          }
          console.log("emit typing ");
          // console.log("roomId");
          // console.log(roomId.roomId);
          
        },
        getRooms(){
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
        initSocket(){
          this.socket = io(API_URL + "/chat", {
              auth: {
                  id: document.cookie
              }
            }
          )
        },
        roomActionHandler({ roomId, action }) {
          console.log("roomActionHandler");
          console.log(action);
          console.log(roomId);
          switch (action.name) {
            case 'join':
              console.log("case join");
              for (let index = 0; index < this.rooms.length; index++) {
                if(this.rooms[index].roomId == roomId)
                {
                  if (this.rooms[index].access == 'protected')
                  {
                    const result = prompt("This room is protected\n password", "password")
                    console.log(result);
                      this.socket.emit('join', {roomId: roomId, password: result})
                      // this.makePopupJoin(roomId)
                    } else {
                      this.socket.emit('join', {roomId: roomId})
                  }
                }
              }
              this.updateMessages(roomId)
              break;
              case 'leave':
                this.updateMessages(roomId)
              default:
                this.socket.emit(action.name, roomId)
              break;
          }
        },
        addMessage(message) {
          console.log("addMessage");
          console.log(this.messages.length);
          const messages = []
          for (let i = 0; i < this.messages.length; i++) {
            messages.push(this.messages[i])
          }
          messages.push(message)
          this.messages = messages
          console.log(this.messages.length);
          console.log(this.messages[this.messages.length - 1]);
          console.log(this.messages[this.messages.length - 2]);

          console.log("addMessage ende");
        }

      },
      created() {
        console.log("created");
        this.initSocket();
      },
      beforeMount() {
        console.log("beforeMount");
      },
      mounted() {
       
        this.socket.on('typing',({ userId, isTyping , roomId}) => {
          console.log('typing');
          const room = this.rooms.find((room) => {
            return room.roomId === roomId
          })
          console.log(room.roomId)
          console.log(isTyping)
          console.log(userId)

          console.log(room.typingUsers)
          if(isTyping) {
            console.log(room.typingUsers)
            if(room.typingUsers == undefined || room.typingUsers.length == 0)
              room.typingUsers = [ userId ]
            else if(room.typingUsers.indexOf(userId) == -1)
              room.typingUsers = [...room.typingUsers, userId]

          } else {
            const typingUsers = []
            for (let i = 0; i < room.typingUsers.length; i++) {
                if (room.typingUsers[i] != userId)
                  typingUsers.push(room.typingUsers[i])
              }
              room.typingUsers = typingUsers
          }

          console.log("before ende typing");
          console.log(room.typingUsers);
          console.log("ende typing");
        });

        this.socket.on('message',({message, roomId}) => {
          console.log('message');
          console.log(message);
          console.log(roomId);
          console.log(this.currentRoomId);
          if(this.currentRoomId == roomId) {

            console.log("this.currentRoomId == roomId");
            this.addMessage(message)
            console.log("this.currentRoomId == roomId behind");
          } else {
            console.log("message for an other room");
          }
          console.log("message ende");

        });

        this.getRooms();
        this.currentUserId = this.$store.getters.getUser._id;

        console.log("mounted CHAT");
        // console.log(this.currentUserId)
      }      
    }
</script>

<!-- <script lang="ts">
    import { register } from 'vue-advanced-chat'
    
      export default {
        data() {
          return {
            register: register,
            currentUserId: '1234',
            rooms: [],
            messages: [],
            roomActions: [
              { name: 'inviteUser', title: 'Invite User' },
              { name: 'removeUser', title: 'Remove User' },
              { name: 'deleteRoom', title: 'Delete Room' }
            ]
          }
        }
      }
</script> -->