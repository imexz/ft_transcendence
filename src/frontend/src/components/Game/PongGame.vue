<template>
  <div v-show="this.$store.state.game != null">
      <GamePlayers/>
    <div v-if="this.$store.state.winner == null" class="gameCanvas">
      <div>
        <Field @assignWinner="assignWinner"/>
      </div>
      <!-- TODO: check if leave button is still needed -->
      <div v-show="this.$store.state.user._id!=this.$store.state.game?.playerRight?._id && this.$store.state.user._id!=this.$store.state.game?.playerLeft?._id"  class="leaveGame">
        <button @click="leaveGame"> Leave </button>
      </div>
    </div>
	</div>
	<div class="queue" v-show="this.$store.state.game == null && this.$store.state.winner == null">
    <text> Waiting for a match... </text>
		<button @click="leaveGame"> Leave </button>
	</div>
  <div v-if="this.$store.state.winner != null && this.$store.state.game == null">
        <Result :winner = this.$store.state.winner @newGame="newGame" />
  </div>
</template>

<script lang="ts">
  import { Socket } from "socket.io-client";
  import { defineComponent } from 'vue';
  import Game from '@/models/game';
  import GamePlayers from './GamePlayers.vue'
  import Result from './Result.vue'
  import Field from './Field.vue'
  import User from "@/models/user";


  export default defineComponent({
  	data () {
  		return {
			  // winner: null as User,
        fps: 0,
  		}
  	},
  	components: {
      GamePlayers,
      Result,
      Field
    },
  	created() {
  		console.log("in created"); 
  		this.$store.state.socketGame.on('Game', (game: Game) => {
        console.log(game)
        this.assignGame(game)
		  });
      if (this.$store.state.game == null && this.$store.state.winner == null) {
        this.$store.state.socketGame.emit('checkGame', (game: Game) => {
          console.log(game)
        });
      }
  	},
  	mounted() {
  		console.log("mounted");
  	},
		beforeUpdate() {
  		console.log("beforeUpdate");
      if (this.$store.state.game == null && this.$store.state.winner == null) {
        this.$store.state.socketGame.emit('checkGame', (game: Game) => {
          console.log(game);
        });
      }
		  console.log("leaving beforeUpdate");
	  },
  	unmounted() {
  		console.log("in unmount");
      this.$store.state.socketGame.emit('Quit')
      this.$store.state.socketGame.off('Game')
  	},
  	methods: {
      newGame(){
        console.log("newGame");
        this.$store.state.winner = null
      },
      assignWinner(winner: User) {
        console.log("assignWinner");
        this.$store.state.winner = winner
      },
      assignGame(game: Game) {
        this.$store.state.game = game
        if (this.$store.state.game.playerRight != undefined) {
  			  document.addEventListener('keydown', this.keyEvents, false);
        }
      },
      keyEvents(event) {
        if (!this.finished) {
          console.log(event.key);
          this.$store.state.socketGame.emit('key', event.key)
        }
      },
      leaveGame() {
        this.$store.state.socketGame.emit('leaveGame');
        this.$store.state.game = null
        this.$router.push("/");
      }
  	}
  })
</script>

<style scoped>

.queue {
	padding-top: 100px;
	font-size: 20px;
	text-align: center;
}

.matchInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 60px;
  width: 640px;
  margin: auto;
  margin-bottom: 20px;
  padding: 10px 20px 10px 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

}

.gameCanvas {
  display: inline-block;
  padding: 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

}

</style>
