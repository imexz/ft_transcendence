<template>
  <div v-if="this.game && this.socketGame">
    <PongGame :game = "this.game" :socket = "this.socketGame" @reset="this.reset()" />
    <div v-show="this.$store.state.user.id!=this.game?.loser?.id && this.$store.state.user.id!=this.game?.winner?.id" class="leaveGame">
        <button @click="this.leaveGame"> Leave </button>
    </div>
  </div>
  <div v-else-if="this.wait == true">
    <text> Waiting for opponent... </text>
    <br>
    <button @click="this.leaveGame"> Leave </button>
  </div>
  <div v-else>
    <GameSettings @setWait="this.setWait()" @reset="this.reset()" :userId="this.userId" :socket = this.socketGame />
  </div>
</template>
  
  <script lang="ts">
  import Game from '@/models/game';
  import { defineComponent } from 'vue';
  import GameSettings from '../components/Game/GameSettings.vue';
  import PongGame from '../components/Game/PongGame.vue';
  import { io, Socket } from 'socket.io-client'
  import { API_URL } from '@/defines';
  import User from '@/models/user';


  export default defineComponent({
    data() {
      return {
        game: null as Game | null,
        wait: false,
        socketGame: null as Socket | null,
      };
    },
    props: {
      userId: String
    },
    async mounted() {
      console.log("in mounted gameMenu");
      this.socketGame = io(API_URL + "/game", {
        auth: {
          id: document.cookie
        }
      })
      
      while (!this.socketGame) {
		  	  await new Promise(r => {setTimeout(r, 100)
            console.log("wait in playview");
            
          });
      }
      this.wait = false
      this.game = null
      this.initGameInfoListener()
      console.log("view mounted");
      
      // await this.askBackendForGame()
    },
    updated() {
      console.log("view updated");
      if (this.game?.isFinished) {
        this.game = null
      }
      // console.log("updated");
      // console.log(this.userId);
      

      
    },
    methods: {
      async setWait(){
        console.log("setWait");
        this.wait = true
      },
      viewGame (game: Game) {
        this.game = game
      },
	    async initGameInfoListener() {
		    this.socketGame.on('GameInfo', (game: Game) => {
          this.reset()
          this.game = new Game()
          this.game.winner = game.winner
          this.game.loser = game.loser
          this.game.scoreWinner = game.scoreWinner
          this.game.scoreLoser = game.scoreLoser
          console.log("GameInfo PlayView", game)
          
		    });
		    this.socketGame.on('isFinished', () => {
          this.wait = false
          if (this.game) {
            this.game.isFinished = true
          }
		    });

	    },
      leaveGame() {
        this.socketGame.emit('leaveGame');
        this.reset()
      },
      
      reset() {
        this.wait = false
        this.game = null
        this.$router.push('/play')
      }
    },
    unmounted() {
      this.socketGame.disconnect();
    },
    components: {
      PongGame,
      GameSettings
    }
  })
  </script>
  
  <style>
  .singleOption {
    margin-top: 14px
  }
  
  .singleOption>button {
    font-size: 20px;
    width: 102px;
    margin-left: 0;
    margin-right: 0;
    margin-top: 4px;
    padding-top: 5px
  }
  
  .singleOption>button.selected {
    font-size: 20px;
    width: 102px;
    background-color: lightgray;
    color: black;
    margin-left: 0;
    margin-right: 0
  }
  </style>
  
<style scoped>

.gameWrapper {
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 800px;
}

</style>