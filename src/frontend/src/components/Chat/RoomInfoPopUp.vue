<template>
  <div class="roomInfoPopUp">
    <div class="headLineWrapper">
      <div class="headLine">{{roomType}}</div>
      <button class="exitButton" @click="closePopUp">
        <font-awesome-icon icon="fa-solid fa-x" />
      </button>
    </div>
    <div class="headLine" >Role: {{getRole}} </div>
    <div v-if="getRole == 'owner'">
      <CreateRoom
      @actions="reEmitRoom" :roomName=room.roomName :roomAccess=room.access> </CreateRoom>
    </div>
    <div v-if="room.admins != undefined" class="userGroup">Admins</div>
    <div class="user" v-for="user in room?.admins">
      <UserSummary v-if="room?.access == Access.dm && user.id != this.$store.state.user.id" :user=user :extraButtons=extraButtonsDm @actions="reEmit"></UserSummary>
      <UserSummary v-else :user=user></UserSummary>
    </div>
    <div class="userGroup">Users</div>
    <div class="user" v-for="user in room?.users">
      <UserSummary
        v-if="!room?.admins?.some((us: User) => us.id == user.id)"
        :user=user
        :extraButtons=extraButtons
        @actions="reEmit"></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserSummary from '@/components/Profile/UserSummary.vue'
import { Access } from '@/models/room';
import User from '@/models/user';
import CreateRoom from './createRoom.vue';

enum AdminAction {
    muted,
    banned,
    toAdmin,
    unMuted
}
export default defineComponent({
  data() {
    return {
      admin: false as boolean,
      extraButtons: [
        {
          icon: "fa-solid fa-comment-slash",
          emit: AdminAction.muted,
          tooltip: "Mute User"
        },
        {
          icon: "fa-solid fa-gavel",
          emit: AdminAction.toAdmin,
          tooltip: "Make Admin"
        },
        {
          icon: "fa-solid fa-ban",
          emit: AdminAction.banned,
          tooltip: "Ban User"
        }
      ],
      AdminAction,
      Access,
      extraButtonsDm: [
        {
          icon: "fa-solid fa-comment-slash",
          emit: AdminAction.muted,
          tooltip: "Mute User"
        }
      ]
    }
  },
  mounted() {
    //console.log("Room in room info", this.room);

  },
  updated() {
    //console.log("updated in room info");
  },
  computed: {
    getRole(): string{
      if (this.room?.owner?.id == this.$store.state.user.id) {
        return "owner"
      }
      if (this.room?.admins?.find(elem => elem.id == this.$store.state.user.id)){
        return "admin"
      } else {
        return "user"
      }
    },
    roomType() {
      switch(this.room?.access) {
        case Access.dm :
          return "Direct Message"
        case Access.protected :
          return "Protected Chatroom"
        case Access.private:
          return "Private Chatroom"
        default :
          return "Public Chatroom"
      }
    }
  },
  methods: {
    reEmitRoom(emitMsg: string) {
      this.$emit('actions', emitMsg)
    },
    reEmit(emiType: AdminAction, userId){
      //console.log(emiType, userId);

      this.$store.state.chat.socketChat.emit('actions', {emiType, userId, roomId: this.room.roomId}, (type) => {
        //console.log("return", type)
        switch (type) {
          case AdminAction.muted:
            this.extraButtonsDm[0].icon = "fa-solid fa-comment"
            this.extraButtonsDm[0].tooltip = "Unmute User"
            break;
          case AdminAction.unMuted:
            this.extraButtonsDm[0].icon = "fa-solid fa-comment-slash"
            this.extraButtonsDm[0].tooltip = "Mute User"
          default:
            break;
        }

        if (type == AdminAction.muted) {
          //console.log("type muted")

        }

      })
    },
    closePopUp(){
      this.$emit('actions', "exit")
    }
  },
  components: {
    UserSummary,
    CreateRoom
  },
  props: {
    room: {
      type: Object,
      default: null
    }
  }
})

</script>

<style scoped>

.roomInfoPopUp {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 200px;
    width: 400px;
    height: 400px;
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 10px;
    z-index: 10;
    overflow-y: auto;
  }
.headLineWrapper {
    margin-top: 15px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid var(--ft_cyan);
    display: flex;
    justify-content: space-between;
  }

  .headLine {
    font-size: 25px;
    font-weight: bold;
  }

  .exitButton {
    height: 30px;
    width: 30px;
    font-weight: bold;
    padding: 3px;
    border-radius: 50%;
    border: 2px solid var(--ft_pink);
    color: var(--ft_pink);
    background-color: var(--ft_dark);
  }
  .exitButton:hover {
    color: var(--ft_dark);
    background-color: var(--ft_pink);
  }

  .userGroup {
    font-size: 25px;
    font-weight: bold;
    border-bottom: 1px solid var(--ft_cyan);
    margin: 10px;
  }
  .user {
    margin: 10px;
  }
</style>