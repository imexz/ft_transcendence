<template>
  <div class="userSummary">
    <div v-if="showDm" class="dmPopUp">
      <div class="headLineWrapper">
        <div class="headLine">Direct Message</div>
        <button class="exitButton" @click="closeDmPopUp">
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </div>
      <form @submit.prevent="sendDm">
        <textarea class="dmText" v-model="msgText" placeholder="your message" rows="4">
        </textarea>
        <button class="dmButton">Send</button>
      </form>
    </div>
    <div v-if="showGame" class="dmPopUp">
      <ViewGamePopup @actions="viewGame" :game="game" :userId="user.id" />
    </div>
    <div class="normalView">
      <img :src="user?.avatar_url" alt="Avatar">
      <div>
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
      <div class="toggleDropdown" @click="toggleDropdown">
        <font-awesome-icon icon="fa-solid fa-bars" />
      </div>
    </div>
    <div class="dropdownMenu" v-if="show">
      <button
        v-if="$store.getters.getFriends != '' && $store.getters.getFriends.some((us: User) => us.id == user.id)"
        class="dropdownElement"
        @click="removeFriend">
        <font-awesome-icon icon="fa-solid fa-user-minus" />
      </button>
      <button
        v-else
        class="dropdownElement"
        @click="addFriend">
        <font-awesome-icon icon="fa-solid fa-user-plus" />
      </button>
      <button
        class="dropdownElement"
        @click="viewProfile(user?.id)" >
        <font-awesome-icon icon="fa-solid fa-eye" />
      </button>
      <button
        class="dropdownElement"
        @click="toggleDmPopUp">
        <font-awesome-icon icon="fa-solid fa-message" />
      </button>
      <button
        class="dropdownElement">
        <font-awesome-icon icon="fa-solid fa-ban" />
      </button>
      <button
        class="dropdownElement"
        @click="askForMatch">
        <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" />
      </button>
      <button
        v-for="button in extraButtons"
        class="dropdownElement"
        @click="customEmit(button.emit)">
        <font-awesome-icon :icon="button.icon"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { Status } from '@/enums/models/ResponseEnum';
import ViewGamePopup from '../Game/ViewGamePopup.vue';
import GamePlayers from '../Game/GamePlayers.vue';
import { defineAsyncComponent } from 'vue'
import{ UserStatus }from '@/models/user'

import Game from '@/models/game';

export default defineComponent({
  components: {
    ViewGamePopup,
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
    }
  },
  props : {
    user: {
      type: Object,
      default: null
    },
    extraButtons: {
      type: Array,
      default: []
    },
  },
  methods: {
    customEmit(emitMsg){
      this.$emit('action', emitMsg, this.user.id)
    },
    addFriend(): void {
      this.$store.state.socket.emit('Request', {id: this.user.id})
      this.user.friendStatus = Status.pending
      this.$store.commit("addFriend", this.user)
    },
    response(status: Status){
      if(status == Status.accepted){
        this.user.friendStatus = null
      } else {
        this.$store.commit("removeFriend", this.user.id)
      }
      this.$store.state.socket.emit('Response', {id: this.user.id, status: status})
      console.log("response", status)
    },
    removeFriend(){
      this.$store.state.socket.emit('Remove', {id: this.user.id})
      this.$store.commit("removeFriend", this.user.id)
    },
    viewProfile(id: number){
      this.show = false;
      this.$router.push('/profile/' + id.toString());
    },
    hideDropDown(e){
      console.log("hi")
      if (!this.$el.contains(e.target))
        this.toggleDropdown()
    },
    toggleDropdown() {
      if (this.show){
        window.removeEventListener('click', this.hideDropDown)
        this.closeDmPopUp();
        this.showGame = false;
      }
      else
        window.addEventListener('click', this.hideDropDown)
      this.show = !this.show
    },
    // for match and spectate
    askForMatch(){
      this.closeDmPopUp()
      if (this.user.id === this.$store.state.user.id) return;
      this.$store.state.winner = null;
      this.$store.state.socketGame.emit('GameRequestBackend', {id: this.user.id}, (r) => { 
        
        if (r != undefined) {
          this.showGame = !this.showGame
          if(r.playerLeft == this.$store.state.user.id || r.playerRight == this.$store.state.user.id)
            this.$store.state.pendingRequest = true;
          this.$router.push("/play")
        }
        this.$store.state.game = r
      })
      console.log("AskForMatch");
    },
    viewGame(status){
      switch (status) {
        case 'exit':
          this.showGame = false;
          break;
        case 'view':
          this.$store.state.socketGame.emit('ViewGame', {id: this.user.id}, () => {
            this.showGame = !this.showGame
            this.$router.push('/play')
          });
          console.log("viewGame");
          break;
      }
    },
    openDmPopUp(){
      window.addEventListener('click', this.hideDm)
      this.showDm = true;
      this.showGame = false;
    },
    closeDmPopUp(){
      window.removeEventListener('click', this.hideDm)
      this.showDm = false;
    },
    toggleDmPopUp(){
      if (this.showDm)
        this.closeDmPopUp()
      else
        this.openDmPopUp()
    },
    hideDm(e){
      if (!this.$el.contains(e.target))
        this.closePopUp()
    },
    sendDm(){
      console.log(this.msgText)
      this.closeDmPopUp()
      this.toggleDropdown()
      this.$store.state.socketChat.emit('DM', {content: this.msgText, id: this.user.id})
      this.msgText = ""
    }

  },
})

</script>

<style scoped>
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--ft_cyan);
    object-fit: cover;
  }
  .userSummary {
    position: relative;
    /* width: 316px; */
    min-width: 253px;
    /* width: 253px; */
    border: 2px solid;
    border-image: linear-gradient(90deg, var(--ft_cyan), var(--ft_pink)) 1;
  }
  .normalView {
    padding: 5px;
    font-size: 25px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  .toggleDropdown {
    padding: 10px;
    align-items: center;
    display: flex;
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
  }
  .toggleDropdown:active {
    transform: translateY(1px);
  }

  .toggleDropdown:hover {
    color: var(--ft_dark_purple);
    background-color: var(--ft_cyan);
  }
  .dropdownElement:active {
    transform: translateY(1px);
  }
  .dropdownElement:hover {
    background-color: var(--ft_dark_purple);

  }
  .dmPopUp {
    position: absolute;
    top: 108px;
    left: -2px;
    width: 100%;
    /* height: 350px; */
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

  .status {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    resize: none;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
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
</style>