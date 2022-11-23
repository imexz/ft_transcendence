<template>
<!-- <div v-if="this.dataRdy"> -->
  <!-- <div class="queue" v-show="this.game == null">
    <text> Waiting for opponent... </text>
    <br>
    <button @click="this.leaveGame"> Leave </button>
  </div> -->
  <div v-show="this.game.isFinished == false">
		<GamePlayers :game = this.game />
		<div class="gameCanvas">
      <div>
        <!-- <Field @assignWinner="this.assignWinner"/> -->
        <Field :socket = "this.socket" />
      </div>
    </div>
  </div>
  <div v-if="this.game?.isFinished">
	  <Result :game = this.game :socket = this.socket @newGame="this.prepareNewGame" />
  </div>
<!-- </div> -->
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Game from '@/models/game';
  import GamePlayers from './GamePlayers.vue'
  import Result from './Result.vue'
  import Field from './Field.vue'
  import { Socket } from 'socket.io-client'



  export default defineComponent({
  	data() {
  		return {
		    dataRdy: false,
        fps: 0,
  		}
  	},
    props: {
      game: Game,
      socket: Socket
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
		  // await this.initGameInfoListener();
		  this.dataRdy = true;
      while (!this.socket) {
		  	  await new Promise(r => 
          {setTimeout(r, 100)
          console.log("wait in ponggame")}
          
          );
      }
  	},
		async beforeUpdate() {
  		console.log("beforeUpdate");
      // if (this.$store.state.game == null) {
      //   await this.$store.state.socketGame.emit('joinOrCreatGame', {isCustomized: this.$store.state.customized});
      // }
		  console.log("leaving beforeUpdate");
	  },
  	unmounted() {
  	  console.log("in unmount");
      // this.$store.state.socketGame?.off('GameInfo')
      // document.removeEventListener('keydown', this.keyEvents, false);
  	},
  	methods: {

      prepareNewGame(){
        console.log("newGame");
        this.$emit("reset")
        // this.$store.state.winner = null
        // this.$store.state.loser = null
        // this.$store.state.game = null
      },
      // assignWinner(data: {winner: User, loser: User}) {
      //   console.log("assignWinner");
      //   this.$store.state.winner = data.winner
      //   this.$store.state.loser = data.loser
      // },
      // assignGame(game: Game) {
        // this.$store.state.game = game
        // this.$store.state.game.isFinished = false
        // if (this.$store.state.game.loser != undefined) {
  	  	//   document.addEventListener('keydown', this.keyEvents, false);
        // }
      // },
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
