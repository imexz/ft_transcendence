<template>
  <div v-if="socket" class="chatWrapper">
    <div class="chatBanner"></div>
    <div class="headLine">
      <span>Chat</span>
    </div>
    <div>
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
      :show-new-messages-divider="false"
      :styles="JSON.stringify(style)"
      :spinner-icon-messages="{}"
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
    </vue-advanced-chat>
  </div>
    <div class="chatFooter"></div>
    <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
    <div v-if="createRoomPopUp" class="createRoomPopUp">
      <createRoomPopup @actions="createRoomActions"/>
    </div>
    <div v-if="roomInfoPopUp" class="roomInfoPopUp">
      <roomInfoPopUp :room="roomInfoData" @action="roomInfoActions"/>
    </div>
  </div>
</template>

  <script lang="ts">
  import { io, Socket } from 'socket.io-client';
  import { defineComponent, ref } from 'vue';
  import VueAxios from 'axios';
  import { API_URL } from '@/defines';
  import createRoomPopup from '@/components/Chat/createRoomPopup.vue';
  import joinRoomPopup from '@/components/Chat/joinRoomPopup.vue';
  import roomInfoPopUp from '@/components/Chat/RoomInfoPopUp.vue';
  import { customChatStyle } from "@/styles/chatStyle";
  import Toast from "@/components/Toast.vue";
  import Message from '@/models/message';
  import Room from '@/models/room';
  import { Access } from '@/models/room';

  import { register } from 'vue-advanced-chat'
  register()

  export default defineComponent({
    data() {
      return {
          style: customChatStyle,
          height: "800px",
          currentUserId: '',
          currentRoomId: '',
          rooms: [] as Room[],
          messages: [],
          messagesLoaded: false, //TB change this value to show a loading icon on the top of the chat
          messageActions: [
            { name: 'deleteMessage' , title: 'delete message', onlyMe: true },
          ],
          usernameOptions: { minUsers: 3, currentUser: false },
          roomActions: [
            { name: 'join', title: 'Join Room' },
            { name: 'leave', title: 'Leave Room' }
          ],
          roomActionAdmin: { name: 'settings', title: 'Settings'},
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
          // textMessages : {
          //   ROOMS_EMPTY: 'Aucune conversation',
          //   ROOM_EMPTY: 'Aucune conversation sélectionnée',
          //   NEW_MESSAGES: 'Nouveaux messages',
          //   MESSAGE_DELETED: 'Ce message a été supprimé',
          //   MESSAGES_EMPTY: 'No Messages',
          //   CONVERSATION_STARTED: 'La conversation a commencée le :',
          //   TYPE_MESSAGE: 'Tapez votre message',
          //   SEARCH: 'Rechercher',
          //   IS_ONLINE: 'est en ligne',
          //   LAST_SEEN: 'dernière connexion ',
          //   IS_TYPING: 'est en train de taper...',
          //   CANCEL_SELECT_MESSAGE: 'Annuler Sélection'}
          }
      },
      components:{
        createRoomPopup,
        joinRoomPopup,
        roomInfoPopUp,
        Toast,
      },
      methods: {
        async initChatInfoListener() {
      while (!this.$store.state.socketChat || !this.$store.state.rooms) {
        await new Promise(r => setTimeout(r, 100));
      }},
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
        putMessages({room}) {
          console.log("putMessages");
          this.currentRoomId = room.roomId
          this.updateMessages(room.roomId)
          // this.messagesLoaded = true;
        },

        updateMessages(roomId) {
          console.log("updateMessages", this.messagesLoaded);
          console.log(roomId);
          // this.socket.emit('findAllMessages', {roomId: roomId}, (response) => {
          //   console.log("mesages_old: ", response);

          //   console.log(response, "ende");
          //   this.messages = response;
          //   this.messagesLoaded = true;
          // })
          // console.log("rooms:", this.rooms);
          for (let i = 0; i < this.rooms.length; ++i)
          {
            if (this.rooms[i].roomId == roomId) {
              if(this.rooms[i].messages != undefined)
                this.messages = this.rooms[i].messages
            }
          }
          console.log("messages of room:", roomId, this.messages);

          let room = this.$store.state.rooms.find(elem => elem.roomId == roomId)
          // room.messagesLoaded = true
          // console.warn(this.$store.state.rooms.find(elem => elem.roomId == roomId));

          room.unreadCount = 0;
          this.messagesLoaded = true;
          console.log("endeende");

        },
        sendMessage({ roomId, content}) {
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
          console.log("pupUp isOpen:", this.createRoomPopUp)
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
            console.log("clicked on join");

            this.$store.state.socket.emit('join', {roomId: roomId, password: this.password}) //TB is this used???
          }
          console.log(this.PoppupJoin);
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
          console.log("emit typing ende");
        },
        fillMessagesData(){
          // this.rooms.forEach(
          //   messages => messages.forEach(
          //     username => username = "test"
          //   )
          // )
        },
        getRooms(){
            // VueAxios({
            //     url: '/chatroom/all',
            //     baseURL: API_URL,
            //     method: 'GET',
            //     withCredentials: true,
            // })
            //     .then(response => {
            //     console.log(response.data);

                // this.rooms = response.data
                // })
                // .catch()
            this.rooms = this.$store.getters.getRooms;
            this.fillMessagesData();
            console.log("get rooms: ", this.rooms);

        },
        initSocket(){
          this.socket = this.$store.state.socketChat
          if (this.socket){
            this.socket.off('message')
          }
          console.log("initSocket")
        },
        async roomActionHandler({ roomId, action }) {
          console.log("roomActionHandler");
          console.log(action);
          console.log(roomId);
          switch (action.name) {
            case 'join':
              console.log("case join");
              for (let index = 0; index < this.rooms.length; index++) {
                if(this.rooms[index].roomId == roomId)
                {
                  console.log("next")
                  var result: string = undefined
                  if (this.rooms[index].access == Access.protected)
                    result = prompt("This room is protected\n password", "password") // @Tobi please rework this popup so it matches the style of our website, can be triggered by trying to join a protected room

                    console.log(result);
                    console.log("roomIdFrontend", roomId);

                    this.socket.emit('join', {roomId: roomId, password: result}, (response)=> {this.room = response})

                    console.log(this.messages);

                    console.log("after join");

                    //  this.updateMessages(roomId))
                }
              }

              // this.updateMessages(roomId)
              break;
              case 'leave':
                this.updateMessages(roomId)
                this.socket.emit('leave', roomId)
                break;
              default:
                this.socket.emit(action.name, roomId)
              break;
          }
        },
        roomInfo({ roomId }) {
          this.socket.emit(
            'roomInfo',
            {roomId: roomId},
            data => { 
              this.roomInfoData = data
              console.log("roomInfoData", data)
              this.toggleRoomInfo()
            }
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
          console.log("toggleRoomInfo");
          if (this.roomInfoPopUp)
            window.removeEventListener('click', this.hideRoomInfo)
          else
            window.addEventListener('click', this.hideRoomInfo)
          this.roomInfoPopUp = !this.roomInfoPopUp
          console.log("toggleRoomInfo ende");
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
          console.log("addMessage", message);
          console.log(this.messages.length);
          // let messages = [] as Message[]
          // let i = 0
          // for (; i < this.messages.length; i++) {
          //   messages[i] = new Message(this.messages[i], this.Room.findUser(this.messages[i].senderId))
          // }
          // messages = this.messages;
          this.messages[this.messages.length] = new Message(message)
          // this.messages = messages
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
      async mounted() {
        await this.initChatInfoListener()
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
          console.log("roomId", room.roomId)
          console.log("bool", isTyping)
          console.log("userId", userId)

          console.log("array of typing users", room.typingUsers)
          if(isTyping) {
            console.log("before", room.typingUsers)
            if(room.typingUsers == undefined || room.typingUsers.length == 0)
              room.typingUsers = [ userId ]
            else if(room.typingUsers.indexOf(userId) == -1)
              room.typingUsers = [ ...room.typingUsers, userId ]

            console.log("after", room.typingUsers);


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

        // this.socket.on('message',({message, roomId}) => {
        //   console.log('message');
        //   console.log(message);
        //   console.log(roomId);
        //   console.log(this.currentRoomId);
        //   if(this.currentRoomId == roomId) {

        //     console.log("this.currentRoomId == roomId");
        //     this.addMessage(message)
        //     console.log("this.currentRoomId == roomId behind");
        //   } else {
        //     console.log("message for an other room");
        //   }
        //   console.log("message ende");

        // });

        this.getRooms();
        this.currentUserId = this.$store.getters.getUser.id;

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
    position: relative;
    width: 800px;
    margin: auto;
    margin-top: 80px;
    margin-bottom: 80px;
    z-index: 1;
  }

  .headLine {
    position: absolute;
    top: 129px;
    left: 325px;
    width: 150px;
    height: 41px;
    font-size: 30px;
    font-weight: bold;
    background-color: var(--ft_dark);
    border: 2px solid var(--ft_cyan);
    border-radius: 10px 10px 0px 0px;
    border-bottom: none;
  }

  .chatBanner {
    width: 100%;
    height: 170px;
    background: url(@/assets/chatBanner.png);
    background-size: cover;
    background-position: 0px 420px;
    border: 2px solid var(--ft_cyan);
    border-bottom: none;
    border-radius: 10px 10px 0px 0px ;
  }
  .chatFooter {
    width: 100%;
    height: 20px;
    border: 2px solid var(--ft_cyan);
    border-radius: 0px 0px 10px 10px;
    border-top: none;
  }

</style>