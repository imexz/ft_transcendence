<template>
<div v-if="dataRdy">
  <div v-show="this.$store.state.game != null">
		<GamePlayers/>
		<div v-if="this.$store.state.winner == null" class="gameCanvas">
			<div>
        <Field @assignWinner="assignWinner"/>
	</div>
      <div v-show="this.$store.state.user.id!=this.$store.state.game?.playerRight?.id && this.$store.state.user.id!=this.$store.state.game?.playerLeft?.id"  class="leaveGame">
        <button @click="leaveGame"> Leave </button>
      </div>
    </div>
  </div>
  <div class="queue" v-show="this.$store.state.game == null && this.$store.state.winner == null">
    <text> Waiting for opponent... </text>
	<br>
	<button @click="leaveGame"> Leave </button>
  </div>
  <div v-if="this.$store.state.winner != null && this.$store.state.game == null">
	<Result :winner = this.$store.state.winner @newGame="newGame" />
  </div>
</div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Game from '@/models/game';
  import GamePlayers from './GamePlayers.vue'
  import Result from './Result.vue'
  import Field from './Field.vue'
  import User from "@/models/user";


  export default defineComponent({
  	data() {
  		return {
		dataRdy: false,
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
  	},
  	async mounted() {
  		console.log("mounted");
		await this.initGameInfoListener();
      	if (this.$store.state.game == null && this.$store.state.winner == null) {
        	this.$store.state.socketGame.emit('isInGame');
     	}
		this.dataRdy = true;
  	},
		beforeUpdate() {
  		console.log("beforeUpdate");
      if (this.$store.state.game == null && this.$store.state.winner == null) {
        this.$store.state.socketGame.emit('isInGame', (game: Game) => {
          console.log(game);
        });
      }
		console.log("leaving beforeUpdate");
	  },
  	unmounted() {
  	  console.log("in unmount");
      // this.$store.state.socketGame.emit('quitPendingGame')
      // this.$store.state.socketGame.off('GameInfo')
  	},
  	methods: {
	  async initGameInfoListener() {
		while (!this.$store.state.socketGame) {
			await new Promise(r => setTimeout(r, 100));
		}
		this.$store.state.socketGame.on('GameInfo', (game: Game) => {
        	console.log(game)
        	this.assignGame(game)
		});
	  },
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
        // if (!this.finished) {
          console.log(event.key);
          this.$store.state.socketGame.emit('key', event.key)
        // }
      },
      leaveGame() {
        this.$store.state.socketGame.emit('leaveGame');
        this.$store.state.game = null
		this.$store.state.pendingRequest = false
		this.$store.winner = null
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
