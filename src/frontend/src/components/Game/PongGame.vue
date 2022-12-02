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
  		return { }
  	},
    emits: ['reset'],
    props: {
      game: Game,
      socket: Socket
    },
  	components: {
      GamePlayers,
      Result,
      Field
    },
  	async mounted() {
		  this.dataRdy = true
      while (!this.socket) {
		  	  await new Promise(r => { setTimeout(r, 100) })
      }
  	},
  	methods: {
      prepareNewGame(){
        this.$emit("reset")
      }
  	}
  })
</script>
