<template>
  <div v-if="socket" class="chatWrapper">
    <h1>Chat</h1>
    <vue-advanced-chat
      :height="height"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      :rooms-loaded="true"
      :messages-loaded="messagesLoaded"
      :message-actions="JSON.stringify(messageActions)"
      :username-options="JSON.stringify(usernameOptions)"
      :show-audio="false"
      :show-files="false"
      :show-reaction-emojis="true"
      :room-info-enabled="true"
      :styles="JSON.stringify(style)"
      @send-message="sendMessage($event.detail[0])"
      @send-message-reaction="sendMessageReaction($event.detail[0])"
      @add-room="toggleCreateRoom"
      @room-action-handler="roomActionHandler($event.detail[0])"
      @room-info="roomInfo($event.detail[0])"
      @typing-message="emitTyping($event.detail[0])"
      @fetch-messages="putMessages($event.detail[0])"
      @delete-message="deleteMessage($event.detail[0])"
      @message-action-handler="messageActionHandler($event.detail[0])"
    >
    <!-- <div slot="room-list-item_1">
      This is a new room header
    </div> -->
    </vue-advanced-chat>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div v-if="createRoomPopUp" class="createRoomPopUp">
      <createRoomPopup @actions="createRoomActions"/>
    </div>

    <div v-if="roomInfoPopUp" class="roomInfoPopUp">
      <roomInfoPopUp :roomInfo="roomInfoData" @action="roomInfoActions"/>
    </div>

    <!-- <joinRoomPopup
      v-if="PoppupJoin"
      :TogglePopup="() => makePopupJoin()"
      :password="password"
      :roomId="">
      <h2>Join Room</h2>
    </joinRoomPopup> -->
    </div>
  </template>

  <script lang="ts">
  import { register } from 'vue-advanced-chat'
  import { io, Socket } from 'socket.io-client';
  import { defineComponent, ref } from 'vue';
  import VueAxios from 'axios';
  import { API_URL } from '@/defines';
  import createRoomPopup from '@/components/Chat/createRoomPopup.vue';
  import joinRoomPopup from '@/components/Chat/joinRoomPopup.vue';
  import roomInfoPopUp from '@/components/Chat/RoomInfoPopUp.vue';
  import { customChatStyle } from "@/styles/chatStyle";
  import Toast from "@/components/Toast.vue";

  register()

    export default defineComponent({
      data() {
        return {
          style: customChatStyle,
          height: "800px",
          currentUserId: '',
          currentRoomId: '',
          rooms: [],
          messages: [],
          messagesLoaded: false, //TB change this value to show a loading icon on the top of the chat
          messageActions: [
            { name: 'deleteMessage' , title: 'delete message', onlyMe: true },
            { name: 'profile', title: 'show profile'},
            // { name: 'block', title: 'block user'},
            // { name: 'play', title: 'play with user' },
          ],
          usernameOptions: { minUsers: 3, currentUser: false },
          roomActions: [
            { name: 'join', title: 'Join Room' },
            { name: 'leave', title: 'Leave Room' },
            { name: 'deleteRoom', title: 'Delete Room' }
          ],
          // templatesText: [ //TB did not work as expected at first
          //   { tag: 'help', text: 'shows all commands' },
          //   { tag: 'ban', text: 'ban a user for x seconds' },
          //   { tag: 'mute', text: 'mute a user for x seconds' }
          // ],
          createRoomPopUp: ref(false),
          PoppupJoin: ref(false),
          roomInfoPopUp: ref(false),
          roomInfoData: null as Object | null,
          password: '',
          timeout: 0,
          typing: false,
  		    socket: null,
          chatTheme: "dark",
          showEmojis: true,
          showToast : ref<boolean | null>(false),
          toastMsg : ref<string>(''),
          toastMode : ref<string>(''),
        }
      },
      components:{
        createRoomPopup,
        joinRoomPopup,
        roomInfoPopUp,
        Toast,
      },
      methods: {
        changeSuccess(msg: string) {
          this.showToast = true;
          this.toastMsg = msg;
          this.toastMode = 'success';
          setTimeout(() => this.showToast = false, 2000);
        },
        changeError(errorMsg: string) {
          this.showToast = true;
          this.toastMsg = errorMsg;
          this.toastMode = 'error';
          setTimeout(() => this.showToast = false, 2000);
        },
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
            this.messagesLoaded = true;
          })
        },
        sendMessage({ roomId, content, files, replyMessage }) {
          console.log("createMessage");
          console.log(roomId);
          this.socket.emit('createMessage', { roomId: roomId, content: content}, (response) =>
          {
            console.log("createMessage response");
            console.log(response);
            this.addMessage(response)
          })
        },
        sendMessageReaction({ roomId, messageId, reaction, remove }) {
          console.log("createMessageReaction");
          console.log(roomId);
          this.socket.emit('createMessageReaction', { messageId: messageId, reaction: reaction, remove: remove}, (response) =>
          {
            console.log("createMessageReaction response");
            console.log(response);
            this.addMessage(response)
          })
        },
        toggleCreateRoom() {
          console.log(this.createRoomPopUp)
          if (this.createRoomPopUp)
            window.removeEventListener('click', this.hideCreateRoom)
          else
            window.addEventListener('click', this.hideCreateRoom)
          this.createRoomPopUp = !this.createRoomPopUp
        },
        hideCreateRoom(e) {
          console.log("hi")
          if (!this.$el.contains(e.target)) {
            this.toggleCreateRoom()
          }
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
        // creatRoom(){
        //     VueAxios({
        //         url: '/chatroom/creat',
        //         baseURL: API_URL,
        //         method: 'POST',
        //         withCredentials: true,
        //         data: { room_name: "test", access: "public"}
        //     })
        //         .then(response => {
        //           console.log(response);
        //           if(response != null) {
        //             const rooms = []
        //             for (let i = 0; i < response.length; i++) {
        //               rooms.push(response)
        //             }
        //             this.rooms = rooms
        //             this.$emit('success', 'creat Room')
        //             console.log("succes");
        //           }
        //         })
        //         .catch(error => { this.$emit('error') })
        // },

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
          console.log("emit typing ende");
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
          this.socket = this.$store.state.socketChat
          if (this.socket){
            this.socket.off('message')
          }
          console.log("initSocket")
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
        roomInfo({ roomId }) {
          this.toggleRoomInfo();
          this.socket.emit(
            'roomInfo',
            {roomId: roomId},
            data => { console.log(data), this.roomInfoData = data}
          );
        },
        roomInfoActions(emitMsg, userId, room){
          switch(emitMsg){
            case "mute":
              this.muteUser(userId, room);
              break ;
            case "ban":
              this.banUser(userId, room);
              break;
            case "exit":
              this.toggleRoomInfo();
              break;
          }
        },
        createRoomActions(emitMsg) {
          switch(emitMsg){
            case "success":
              this.getRooms();
              this.toggleCreateRoom();
              this.changeSuccess("Room created")
              break;
            case "error":
              this.toggleCreateRoom();
              this.changeError("Room could not be created")
              break;
            case "exit":
              this.toggleCreateRoom();
              break;
            case "success":

            default:
              break;
          }
        },
        muteUser(userId, roomId){
          console.log("Requesting mute of:", userId, "in room:", roomId)
        },
        banUser(userId, roomId){
          console.log("Requesting ban of:", userId, "in room:", roomId)
        },
        toggleRoomInfo() {
          if (this.roomInfoPopUp)
            window.removeEventListener('click', this.hideRoomInfo)
          else
            window.addEventListener('click', this.hideRoomInfo)
          this.roomInfoPopUp = !this.roomInfoPopUp
        },
        hideRoomInfo(e) {
          if (!this.$el.contains(e.target)) {
            this.toggleRoomInfo()
          }
        },
        messageActionHandler({ roomId, action, message }) {
          console.log("messageActionHandler")
          console.log(roomId)
          console.log(action)
          console.log(message)
          switch (action.name) {
            case 'block':
              {
                console.log("case block");
              }

              break;

            default:
              console.log("default hit on messageActionHandler");
              break;
          }
        },
        deleteMessage({message}) {
          console.log("delete requested")
          const messages = this.messages
          const index = messages.findIndex(element => element._id == message._id)
          if (index != -1)
          {
            messages.splice(index , 1)
            this.messages = messages
            this.socket.emit('deleteMessage', {messageId: message._id}, () => { console.log("success delete");})
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
        this.$store.state.NrMessages = 0;
      },
      beforeMount() {
        this.initSocket();
        console.log("beforeMount", this.socket);
      },
      mounted() {
        console.log("MOUNT", this.socket)
        if (this.socket === null){
          this.$router.push('/login')
          return ;
        }
        this.$store.state.NrMessages = 0;
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
      },
      unmounted() {
        if (this.socket) {
          this.socket.off('typing')
          this.socket.off('message')
          this.socket.on('message',() => {
            this.$store.state.NrMessages++
           console.log("mrmessiges", this.$store.state.NrMessages)
          })
        }
      }
    })
</script>

<style scoped>

  .chatWrapper {
    width: 800px;
    margin: auto;
    margin-bottom: 80px;
    z-index: 1;
  }

</style>