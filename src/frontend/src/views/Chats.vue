<template>
  <div id="content">
    <div id="banner">
      <div id="bannerName">Chat</div>
    </div>
    <div>
      <vue-advanced-chat
        :height="height"
        :current-user-id="currentUserId"
        :rooms.prop=rooms
        :rooms = compRooms
        :messages.prop= messages
        :messages= compMessages
        :room-actions="JSON.stringify(roomActions)"
        :rooms-loaded="true"
        :messages-loaded="messagesLoaded"
        :message-actions="JSON.stringify(messageActions)"
        :username-options="JSON.stringify(usernameOptions)"
        :show-audio="false"
        :show-files="false"
        :show-reaction-emojis="false"
        :room-info-enabled="true"
        :show-new-messages-divider="false"
        :styles="JSON.stringify(style)"
        :spinner-icon-messages="{}"
        :load-first-room="false"
        :user-tags-enabled="false"
        @send-message="sendMessage($event.detail[0])"
        @add-room="toggleCreateRoom"
        @room-action-handler="roomActionHandler($event.detail[0])"
        @room-info="roomInfo($event.detail[0])"
        @toggle-rooms-list="toggleRoomsList($event.detail[0])"
        @fetch-messages="putMessages($event.detail[0])"
        @delete-message="deleteMessage($event.detail[0])"
        @message-action-handler="messageActionHandler($event.detail[0])"
      >
      </vue-advanced-chat>
    </div>
    <div class="chatFooter"></div>
    <div v-if="createRoomPopUp" class="createRoomPopUp">
      <createRoomPopup @actions="createRoomActions"/>
    </div>
    <div>

      <div v-if="roomInfoPopUp" class="roomInfoPopUp">
        <roomInfoPopUp :room="roomInfoData" @actions="roomInfoActions"/>
      </div>
    </div>
  </div>
</template>

  <script lang="ts">
  import { defineComponent } from 'vue';
  import createRoomPopup from '@/components/Chat/createRoomPopup.vue';
  import joinRoomPopup from '@/components/Chat/joinRoomPopup.vue';
  import roomInfoPopUp from '@/components/Chat/RoomInfoPopUp.vue';
  import { customChatStyle } from "@/styles/chatStyle";
  import Message from '@/models/message';
  import Room from '@/models/room';
  import { Access } from '@/models/room';

  const { register } = require('vue-advanced-chat')
  register()
  export default defineComponent({
    data() {
      return {
          style: customChatStyle,
          height: "800px",
          currentUserId: '',
          currentRoomId: '',
          rooms: [] as Room[],
          messages: [] as Message[],
          messagesLoaded: false,
          messageActions: [
            { name: 'deleteMessage' , title: 'delete message', onlyMe: true },
          ],
          usernameOptions: { minUsers: 3, currentUser: false },
          roomActions: [
            { name: 'join', title: 'Join Room' },
            { name: 'leave', title: 'Leave Room' }
          ],
          roomActionAdmin: { name: 'settings', title: 'Settings'},
          createRoomPopUp: false as boolean,
          // PoppupJoin: ref(false),
          roomInfoPopUp: false,
          roomInfoData: null as Object | null,
          password: '',
          timeout: 0,
  		    socket: null,
          chatTheme: "dark",
          showEmojis: true,
          }
      },
      components:{
        createRoomPopup,
        joinRoomPopup,
        roomInfoPopUp,
      },
      computed: {
        compRooms () {
          this.rooms = this.$store.state.chat?.rooms
          this.rooms.forEach(element => {
            let room = this.$store.state.chat.rooms.find(elem => elem.roomId == element.roomId)
            element.unreadCount = room.unreadCount
            element.users = room.users
            element.access = room.access
          });
          this.rooms = [...this.rooms]
        },
        compMessages () {
          this.messagesLoaded = false
          if (this.currentRoomId)
          {
            const currentRoom : Room = this.rooms.find(elem => elem.roomId == this.currentRoomId)
            if (currentRoom !== undefined) {
              currentRoom.unreadCount = 0
              if (currentRoom.messages.length < 1)
                this.messages = []
              else
                this.messages = currentRoom.messages
            }
          }
          else
            this.messages = []
        },
      },
      updated() {
        this.messagesLoaded = true
      },
      methods: {
        async initChatInfoListener() {
          while (!this.rooms) {
            await new Promise(r => setTimeout(r, 10));
          }
        },
        changeSuccess(msg: string) {
          this.$store.dispatch('triggerToast', {msg: msg, mode: 'success', show: true})
        },
        changeError(msg: string) {
          this.$store.dispatch('triggerToast', {msg: msg, mode: 'error', show: true})
        },
        putMessages({room}) {
          this.currentRoomId = undefined
          this.messages = []
          this.currentRoomId = room.roomId
        },

        sendMessage({ roomId, content}) {
          this.$store.state.chat.socketChat.emit('createMessage', { roomId: roomId, content: content}, (response) =>
          {
            if (content.length > 500 && response == false) {
              this.changeError("Message is too long")
            }
          })
        },
        toggleCreateRoom() {
          this.createRoomPopUp = !this.createRoomPopUp
        },
        async roomActionHandler({ roomId, action }) {
          switch (action.name) {
            case 'join':
              for (let index = 0; index < this.rooms.length; index++) {
                if(this.rooms[index].roomId == roomId)
                {
                  var result: string = undefined
                  if (this.rooms[index].access == Access.protected)
                  {
                    result = prompt("This room is protected\n password", "password")
                  }

                    //console.log(result);
                    //console.log("roomIdFrontend", roomId);

                    this.$store.state.chat.socketChat.emit('join', {roomId: roomId, password: result}, (response)=> {
                      // console.log("room after joining", response);
                      // this.$store.state.dispatch('changedRoom', response)
                      // this.$store.state.commit('updateRoom', response)
                      // console.log("@@@before update");

                      // this.updateMessages(roomId)
                    })
                }
              }
              break;
              case 'leave':
                this.$store.state.chat.leaveRoom(roomId)
                break;
              default:
                this.$store.state.chat.socketChat.emit(action.name, roomId)
              break;
          }
        },
        roomInfo({ roomId }) {
          this.roomInfoData = this.$store.state.chat?.getRoomInfo(roomId)
          if(this.roomInfoData != undefined && this.roomInfoData.users.findIndex(elem => elem.id == this.currentUserId) != -1)
              this.activateRoomInfo()
        },
        roomInfoActions(emitMsg, userId, room){
          switch(emitMsg){
            case "mute":
              this.muteUser(userId, room);
              break ;
            case "ban":
              this.banUser(userId, room);
              break;
            case "success":
              this.toggleRoomInfo();
              this.changeSuccess("Room changed")
              break;
            case "error":
              this.toggleRoomInfo();
              this.changeError("Room not changed")
              break;
            case "exit":
              this.toggleRoomInfo();
              break;
          }
        },
        createRoomActions(emitMsg) {
          switch(emitMsg){
            case "success":
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
            default:
              break;
          }
        },
        toggleRoomsList(data) {
          if (data.opened == true)
          {
            this.messages = []
            this.putMessages({room: {roomId: this.currentRoomId}})
          }
          else
          {
            this.messages = []
            this.putMessages({room: {roomId: this.currentRoomId}})
          }

        },
        muteUser(userId, roomId){
          //console.log("Requesting mute of:", userId, "in room:", roomId)
        },
        banUser(userId, roomId){
          //console.log("Requesting ban of:", userId, "in room:", roomId)
        },
        activateRoomInfo(){
          this.roomInfoPopUp = true;
        },
        deactivateRoomInfo(){
          this.roomInfoPopUp = false;

        },
        toggleRoomInfo() {
          if (this.roomInfoPopUp)
            this.deactivateRoomInfo()
          else
            this.activateRoomInfo();
        },

        messageActionHandler({ roomId, action, message }) {
          switch (action.name) {
            case 'block':
              {
                //console.log("case block");
              }

              break;

            default:
              //console.log("default hit on messageActionHandler");
              break;
          }
        },
        deleteMessage({message}) {
          const messages = this.messages
          const index = messages.findIndex(element => element._id == message._id)
          if (index != -1)
          {
            messages.splice(index , 1)
            this.messages = messages
            this.$store.state.chat.socketChat.emit('deleteMessage', {messageId: message._id}, () => { console.log("success delete");})
          }
        },
      },
      created() {
        this.$store.state.NrMessages = 0;
      },
      async mounted() {
        await this.initChatInfoListener()
        this.$store.state.NrMessages = undefined
        if (this.$store.state.chat.socketChat === null){
          this.$router.push('/login')
          return ;
        }
        this.currentUserId = this.$store.state.user.id;
      },
      unmounted() {
        this.$store.state.NrMessages = 0
      },
    })
</script>

<style scoped>


#content {
  position: relative;
  width: 800px;
  margin: auto;
  margin-top: 70px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;
  margin-bottom: 80px;
  z-index: 1;
}

  .chatFooter {
    width: 100%;
    height: 20px;
    border-top: 1px solid var(--ft_cyan);
  }

  #banner {
  width: 100%;
  height: 250px;

  background: url(@/assets/chatBanner.png);
  background-size: cover;
  background-position: 100px 470px;

  border-radius: 10px 10px 0px 0px;

  border-bottom: 2px solid var(--ft_cyan);

  position: relative;
}

#bannerName {
  position: absolute;
  left: 0px;
  top: 60%;

  background-color: var(--ft_dark);

  font-size: 30px;
  font-weight: bold;

  padding: 10px;
  border: 1px solid var(--ft_cyan);
  border-left: none;
  border-radius: 0px 5px 5px 0px;

  animation: slideOut 200ms ease-in-out forwards;
  transform-origin: left center;
}

@keyframes slideOut {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

</style>