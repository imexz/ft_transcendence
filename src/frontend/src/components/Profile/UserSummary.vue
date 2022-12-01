<template>
  <div class="userSummary">
    <div class="userInfoBar">
      <img id="userAvatar" :src="user?.avatar_url" alt="Avatar">
      <div id="middleSection">
        <div id="userName">
          <div>
            <span>{{ user?.username }}</span>
          </div>
          <div style="margin-top: -15px">
            <text class="status"> {{ UserStatus[user?.userStatus] }} </text>
          </div>
        </div>
        <div v-if="user?.friendStatus == Status.requsted" >
          <button @click="response(2)" class="friendButton">
            <font-awesome-icon icon="fa-solid fa-check" />
          </button>
          <button @click="response(3)" class="friendButton">
            <font-awesome-icon icon="fa-solid fa-x" />
          </button>
        </div>
        <div v-if="user?.friendStatus == Status.pending">
          <text id="pendingTxt">pending</text>
        </div>
      </div>
      <div>
        <div v-if="user?.id != this.$store.state.user?.id" class="toggleDropdown" @click="toggleDropdown">
          <font-awesome-icon icon="fa-solid fa-bars" />
        </div>
      </div>
    </div>
    <div v-if="show" class="dropdownMenu">
      <UserActionsPopup :user="user" :extraButtons="extraButtons" @actions="popUpActions"/>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { Status } from '@/enums/models/ResponseEnum';
import ViewGamePopup from '../Game/ViewGamePopup.vue';
import{ UserStatus }from '@/models/user';
import UserActionsPopup from '@/components/Profile/UserActionsPopup.vue';
import Game from '@/models/game';

export default defineComponent({
  created() {
    console.log("created user summary")
  },
  components: {
    ViewGamePopup,
    UserActionsPopup,
  },
  data() {
    return {
      show: false as boolean,
      showDm: false as boolean,
      msgText: "" as string,
      Status: Status,
      UserStatus: UserStatus,
      showGame: false as boolean,
      game: null as Game,
      opponentName: null as String
    }
  },
  mounted() {
    console.log(this.user)
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    extraButtons: {
      type: Array,
      default: []
    },
  },
  emits: ['actions'],
  methods: {
    popUpActions(emit) {
      switch(emit) {
        case "viewProfile":
          this.viewProfile(this.user.id)
          break
        case "close":
          this.toggleDropdown()
          break
        default:
          console.log("popUpActions customEmit", emit)
          this.customEmit(emit)
      }
    },
    customEmit(emitMsg){
      this.$emit('actions', emitMsg, this.user.id)
    },
    response(status: Status) {
      if(status == Status.accepted){
        this.user.friendStatus = null
      } else {
        this.$store.commit("removeFriend", this.user.id)
      }
      this.$store.state.socket.emit('Response', {id: this.user.id, status: status})
    },
    viewProfile(id: number) {
      this.toggleDropdown()
      this.$router.push('/profile/' + id.toString())
    },
    hideDropDown(e) {
      if (!this.$el.contains(e.target))
        this.toggleDropdown()
    },
    toggleDropdown() {
      if (this.show){
        window.removeEventListener('click', this.hideDropDown)
        this.showGame = false
      }
      else
        window.addEventListener('click', this.hideDropDown)
      this.show = !this.show
    },
  },
})

</script>

<style scoped>
  #userAvatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--ft_cyan);
    object-fit: cover;
  }

  #userName {
    overflow: hidden;
  }

  #middleSection {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
  }

  #pendingTxt {
    font-size: 15px;
  }
  .userSummary {
    position: relative;
    min-width: 253px;
    border: 2px solid;
    border-image: linear-gradient(90deg, var(--ft_cyan), var(--ft_pink)) 1;
  }
  .userInfoBar {
    padding: 5px;
    font-size: 25px;
    font-weight: bold;
    display: grid;
    grid-template-columns: 50px auto 50px;
    align-items: center;
  }
  .dropdownMenu {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: absolute;
    border: 2px solid;
    background-color: var(--ft_dark);
    border-image: linear-gradient(90deg, var(--ft_cyan), var(--ft_pink)) 1;
    top: 64px;
    left: -2px;
    z-index: 1;
  }
  .toggleDropdown {
    padding: 10px;
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .toggleDropdown:active {
    transform: translateY(1px);
  }

  .toggleDropdown:hover {
    color: var(--ft_dark_purple);
    background-color: var(--ft_cyan);
  }

  .status {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    resize: none;
    color: var(--ft_cyan);
    font-size: 10px
  }

  .friendButton {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    background-color: var(--ft_dark);
    border-radius: 5px;
    width: 30px;
    height: 30px;
    margin: 1px;
  }
  .friendButton:hover {
    background-color: var(--ft_cyan);
    color: var(--ft_dark);
  }

  .pending {
    background-color: var(--ft_dark_purple);
  }



</style>
