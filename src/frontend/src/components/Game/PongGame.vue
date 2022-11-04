<template>
  <div v-show="this.$store.state.game != null">
      <GamePlayers/>
    <div v-if="this.winner == null" class="gameCanvas">
      <div>
        <Field @asigneWinner="asigneWinner"/>
      </div>
      <div v-show="this.$store.state.user.id!=this.$store.state.game?.playerRight?.id && this.$store.state.user.id!=this.$store.state.game?.playerLeft?.id"  class="leaveGame">
        <button @click="leaveGame"> Leave </button>
      </div>
    </div>
	</div>
	<div class="queue" v-show="this.$store.state.game == null && this.winner == null">
		Waiting for a match...
	</div>
  <div v-if="this.winner != null && this.$store.state.game == null">
        <Result :winner = this.winner @newGame="newGame" />
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
			  winner: null as User,
        fps: 0,
  		}
  	},
  	components: {
      GamePlayers,
      Result,
      Field
    },
  	created() { // always called when Component is initialized (e.g. on refresh)
  		console.log("in created");

  		this.$store.state.socketGame.on('Game', (game: Game) => {
        console.log(game);
        this.asigneGame(game)
		  });
      if (this.$store.state.game == null && this.winner == null) {
        this.$store.state.socketGame.emit('checkGame', (game: Game) => {
          console.log(game);
        });
      }
  	},
  	mounted() {
  		console.log("mounted");
  	},
		beforeUpdate() {
  		console.log("beforeUpdate");
    if (this.$store.state.game == null && this.winner == null) {
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
        this.winner = null
      },
      asigneWinner(winner: User) {
        console.log("asigneWinner");

        this.winner = winner
      },
      asigneGame(game: Game) {
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

/* .gameCanvas {
  display: inline-block;
  padding: 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

} */

</style>
