<template>
  <div v-if="showDm" class="dmPopUp">
    <div class="headLineWrapper">
      <div class="headLine">Direct Message</div>
      <button class="exitButton" @click="closeDmPopUp">
        <font-awesome-icon icon="fa-solid fa-x" />
      </button>
    </div>
    <form @submit.prevent="sendDm">
      <textarea class="dmText" v-model="DMText" placeholder="your message" rows="4">
      </textarea>
      <button class="dmButton">Send</button>
    </form>
  </div>
  <div v-if="showGame" class="dmPopUp">
      <ViewGamePopup @actions="viewGame" :userName=this.opponentName :userId="user.id" />
  </div>
  <div class="dropdownMenu">
    <div class="box" v-if="$store.state.friendsList != '' && $store.state.friendsList.some((us: User) => us.id == user.id)">
      <button
        class="dropdownElement"
        @click="removeFriend">
        <font-awesome-icon icon="fa-solid fa-user-minus" />
      </button>
      <div class="tooltip">
        Remove Friend
      </div>
    </div>
    <div class="box" v-else>
      <button
        class="dropdownElement"
        @click="addFriend">
        <font-awesome-icon icon="fa-solid fa-user-plus" />
      </button>
      <div class="tooltip">
        Add Friend
      </div>
    </div>
    <div class="box">
      <button
        class="dropdownElement"
        @click="viewProfile" >
        <font-awesome-icon icon="fa-solid fa-eye" />
      </button>
      <div class="tooltip">
        View Profile
      </div>
    </div>
    <div class="box">
      <button
        class="dropdownElement"
        @click="toggleDmPopUp">
        <font-awesome-icon icon="fa-solid fa-message" />
      </button>
      <div class="tooltip">
        Send DM
      </div>
    </div>
    <div class="box">
      <button
        class="dropdownElement"
        @click="askForMatchOrSpectate">
        <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" />
      </button>
      <div class="tooltip right">
        Invite / Spectate
      </div>
    </div>
    <div class="box" v-for="button in extraButtons as Button[]">
      <button
        class="dropdownElement"
        @click="customEmit(button.emit)">
        <font-awesome-icon :icon="button.icon"/>
      </button>
      <div class="tooltip right">
        {{ button.tooltip }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Status } from '@/enums/models/ResponseEnum';
import ViewGamePopup from '../Game/ViewGamePopup.vue';
import Game from '@/models/game';
import Button from '@/models/button';
import User from '@/models/user';
import VueAxios from 'axios';
import { API_URL } from '@/defines';


export default defineComponent({
  data() {
    return {
      State: Status,
      DMText: "" as string,
      showDm: false as boolean,
      showGame: false as boolean,
      game: null as Game,
    }
  },
  components: {
    ViewGamePopup,
  },
  props: {
    extraButtons: {
      type: Array,
      default: [],
    },
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['action'],
  methods: {
    toggleDropDown() {
      this.$emit('action', 'close')
    },
    removeFriend() {
      this.$store.state.socket.emit('Remove', {id: this.user.id})
      this.$store.commit("removeFriend", this.user.id)
    },
    addFriend() {
      this.$store.state.socket.emit('Request', {id: this.user.id})
      this.user.friendStatus = Status.pending
      this.$store.commit("addFriend", this.user)
    },
    viewProfile() {
      this.$emit('action', 'viewProfile')
    },
    openDmPopUp(){
      this.showDm = true
      this.showGame = false
      console.log("why")
    },
    closeDmPopUp(){
      this.showDm = false
    },
    toggleDmPopUp(){
      if (this.showDm)
        this.closeDmPopUp()
      else
        this.openDmPopUp()
    },
    sendDm(){
      console.log(this.DMText)
      this.$emit('action', 'close')
      this.$store.state.chat.socketChat.emit('DM', {content: this.DMText, id: this.user.id})
      this.DMText = ""
      this.closeDmPopUp()
    },
    customEmit(emitMsg) {
      this.$emit('action', emitMsg)
    },
    viewGame(status){
      switch (status) {
        case 'exit':
          this.showGame = false
          break
        case 'view':
        VueAxios({
          url: '/game/view/' + this.user.id,
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
          .then(response => { 
            this.$router.push('/play')
          })
          .catch()
          break;
      }
    },
    async askForMatchOrSpectate() {
      const isSelfInvite: boolean = this.user.id === this.$store.state.user.id
      this.closeDmPopUp()
      if (isSelfInvite) return

      VueAxios({
        url: '/game/live/' + this.user.id,
        baseURL: API_URL,
        method: 'Get',
        withCredentials: true,
      })
        .then(res => {
          console.log("api return live game", res)
          if (res.data) {
            console.log("res daat")
            
            this.opponentName = res.data.winner.id == this.user.id ? res.data.loser.username : res.data.winner.username
            console.log("showGame = ", this.showGame)
            this.showGame = !this.showGame
            console.log("showGame = ", this.showGame)
          }
          else {
            this.$router.push('/play/' + this.user.id)
          }
        })
        .catch(error => { this.$emit('actions', 'error') }) 
      console.log("askForMatchOrSpectate")
    },
  },
})

</script>

<style scoped>
  .dropdownMenu {
    display: flex;
    width: 100%;
    justify-content: space-between;
    background-color: var(--ft_dark);
    z-index: 1;
  }
  .dropdownElement {
    /* width: 17%; */
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    margin: 3px;
  }

  .dropdownElement:active {
    transform: translateY(1px);
  }
  .dropdownElement:hover {
    background-color: var(--ft_dark_purple);

  }
  .dmPopUp {
    position: absolute;
    top: 44px;
    left: -1px;
    width: 100%;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    z-index: 11;
  }
  .txt {
    font-size: 25px;
    font-weight: bold;
    width: 100%;
    border-bottom: 1px solid var(--ft_cyan);
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .dmButton {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    background-color: var(--ft_dark);
    padding: 5px 8px;
    font-size: 15px;
    margin: 10px 0px 10px 0px;
  }
  .dmButton:active {
    transform: translateY(1px);
  }
  .dmButton:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }

  .dmText {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    resize: none;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    padding: 5px 8px;
    border-color: var(--ft_cyan);
    border-radius: 5px;
    margin-top: 10px;
    width: 85%;
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

  .box {
    position: relative;
    overflow: inherit;
  }
  .tooltip {
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    padding: 5px;
    white-space: nowrap;

    background-color: black;
    visibility: hidden;
    position: absolute;
    font-size: 15px;
    font-weight: normal;
  }
  .right {
    right: 0px;
  }
  .box:hover .tooltip {
    visibility: visible;
  }
</style>