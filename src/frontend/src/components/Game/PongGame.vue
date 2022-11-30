<template>
  <div v-if="this.game.isFinished == false">
		<GamePlayers :game = this.game />
		<div class="gameCanvas">
      <div>
        <Field :socket = "this.socket" :gameInit="this.game" />
      </div>
    </div>
  </div>
  <div v-if="this.game?.isFinished">
	  <Result :game = this.game :socket = this.socket @newGame="this.prepareNewGame" />
  </div>
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
		  this.dataRdy = true;
      while (!this.socket) {
		  	  await new Promise(r => 
          {setTimeout(r, 100)
          console.log("wait in ponggame")}
          
          );
      }
  	},
		async beforeUpdate() {
  		console.log("beforeUpdate PongGame");
      console.log("winner", this.game.winner);
      console.log("loser", this.game.loser);
		  console.log("leaving beforeUpdate");
	  },
  	unmounted() {
  	  console.log("in unmount");
  	},
  	methods: {

      prepareNewGame(){
        console.log("newGame");
        this.$emit("reset")
      },
  	}
  })
</script>
