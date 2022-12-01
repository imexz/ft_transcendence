<template>
  <div id="gameWrapper">
    <div v-if="this.game && this.socketGame">
      <PongGame :game = "this.game" :socket = "this.socketGame" @reset="this.reset()" />
      <div v-show="this.$store.state.user.id!=this.game?.loser?.id && this.$store.state.user.id!=this.game?.winner?.id" class="leaveGame">
        <button @click="this.leaveGame"> Leave </button>
      </div>
    </div>
    <div v-else-if="this.wait == true">
      <div class="waitScreen">
        <div class="waitIcon"></div>
        <div class="waitText"> Waiting for opponent... </div>
        <div>
          <button class="waitButton" @click="this.leaveGame"> Leave </button>
        </div>
      </div>
    </div>
    <div v-else>
      <GameSettings @setWait="this.setWait()" @reset="this.reset()" :userId="this.userId" :socket = this.socketGame />
    </div>
  </div>
</template>
  
  <script lang="ts">
  import Game from '@/models/game';
  import { defineComponent } from 'vue';
  import GameSettings from '../components/Game/GameSettings.vue';
  import PongGame from '../components/Game/PongGame.vue';
  import { io, Socket } from 'socket.io-client'
  import { API_URL } from '@/defines';


  export default defineComponent({
    data() {
      return {
        game: null as Game | null,
        wait: false,
        socketGame: null as Socket | null,
      }
    },
    props: {
      userId: String
    },
    async mounted() {
      this.socketGame = io(API_URL + "/game", {
        auth: {
          id: document.cookie
        }
      })
      while (!this.socketGame) {
		  	  await new Promise(r => { setTimeout(r, 100)
            console.log("wait in playview")
          })
      }
      this.wait = false
      this.game = null
      this.initGameInfoListener()
      console.log("PlayView mounted")
    },
    updated() {
      console.log("PlayView updated")
      if (this.game?.isFinished && this.userId) {
        this.game = null
      }
    },
    methods: {
      async setWait() {
        console.log("setWait")
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
          console.log("PlayView on GameInfo this.game = ", game)
          
		    });
		    this.socketGame.on('isFinished', (data) => {
          this.wait = false
          if (this.game) {
            this.game.winner = data.winner
            this.game.loser = data.loser
            this.game.isFinished = true
          }
		    })
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
      this.socketGame.disconnect()
    },
    components: {
      PongGame,
      GameSettings
    }
  })
  </script>
    
<style scoped>

  #gameWrapper {
    margin: auto;
    width: 800px;

    height: 1073px;

    margin-top: 70px;
    margin-bottom: 80px;

    border: 2px solid var(--ft_cyan);
    border-radius: 10px;
  }

  .waitScreen {
    width: 400px;
    margin: auto;
    margin-top: 100px;
  }

  .waitIcon {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background-color: var(--ft_cyan);
    margin: auto;
    margin-top: 200px;
    margin-bottom: 300px;
    animation: waiting 2s ease-in-out infinite alternate;
  }

  @keyframes waiting {
    0% {
      transform: translateX(-150px);
      background-color: var(--ft_cyan);
    }
    100% {
      transform: translateX(150px);
      background-color: var(--ft_pink);
    }
  }

  .waitButton {
    width: 130px;

    color: var(--ft_cyan);
    background-color: var(--ft_dark);

    border: 1px solid var(--ft_cyan);
    border-radius: 5px;

    padding: 10px 16px;

    margin-top: 20px;
    font-size: 25px;
    font-weight: bold;
  }

  .waitButton:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
    border-color: var(--ft_cyan);
  }

  .waitButton:active {
    transform: translateY(1px);
  }

  .waitText {
    font-size: 20px;
  }

</style>