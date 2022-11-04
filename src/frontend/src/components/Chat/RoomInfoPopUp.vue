<template>
  <div class="roomInfoPopUp">
    <div class="headLineWrapper">
      <div class="headLine">{{roomType}}</div>
      <button class="exitButton" @click="closePopUp">
        <font-awesome-icon icon="fa-solid fa-x" />
      </button>
    </div>
    <div class="headLine" >Role: {{admin?"Admin":"Member"}}</div>
    <div class="userGroup">Admins</div>
    <div class="user" v-for="user in roomInfo?.room.admins">
      <UserSummary :user=user></UserSummary>
    </div>
    <div class="userGroup">Users</div>
    <div class="user" v-for="user in roomInfo?.room.users">
      <UserSummary
        v-if="!room?.admins.some((us: User) => us.id == user.id)"
        :user=user :extraButtons="admin?extraButtons:[]"
        @action="reEmit"></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserSummary from '@/components/Profile/UserSummary.vue'
import Room from '@/models/room';
import User from '@/models/user';


export default defineComponent({
  data() {
    return {
      room: null,
      admin: false as boolean,
      extraButtons: [
        {
          icon: "fa-solid fa-comment-slash",
          emit: "mute"
        },
        {
          icon: "fa-solid fa-gavel",
          emit: "ban"
        }
      ]
    }
  },
  updated() {
    this.room = this.roomInfo?.room;
    this.admin = this.roomInfo?.isAdmin;
  },
  computed: {
    roomType() {
      switch(this.room?.access) {
        case 3 :
          return "Direct Message"
        case 2 :
          return "Protected Chatroom"
        case 1 :
          return "Private Chatroom"
        default :
          return "Public Chatroom"
      }
    }
  },
  methods: {
    reEmit(emitMsg, userId){
      this.$emit("action", emitMsg, userId, this.room.roomId)
    },
    closePopUp(){
      this.$emit("action", "exit")
    }
  },
  components: {
    UserSummary,
  },
  props: {
    roomInfo :{
      type: Object,
      default: null,
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