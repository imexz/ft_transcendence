<template>
  <div class="wrapper">
    <user-summary :user= this.game.winner />
    <h1> won against </h1>
    <user-summary :user=this.game.loser />
    <div>
      <button id="newGameButton" @click="this.newGame">new game</button>
    </div>
  </div>
</template>

<script lang="ts">
import User from '@/models/user'
import { defineComponent } from 'vue'
import UserSummary from '@/components/Profile/UserSummary.vue';
import Game from '@/models/game';
import { io, Socket } from 'socket.io-client'
import router from '@/router';



export default defineComponent({
    components: {
        UserSummary
    },
    props: {
        game: Game,
        socket: Socket
    },
	unmounted() {
		console.log("result.vue unmounted");
	},
    methods: {
		leaveRoom() {
			this.socket.emit('leaveRoom')
		},
        askForSpecialRematch() {
            router.push('/game/' + this.getOpponentId())
        },

		// askForRematch() {
		// 	console.log("askForRematch");
            

        //     // this.game = null
        //     // this.$emit()
        // },
        // getOpponentId(): number{
        //     // let userId: number;
        //     // if (this.$store.state.user.id === this.game.winner.id) {
        //     //     userId = this.game.loser.id;
        //     // } else if (this.$store.state.user.id === this.game.loser.id) {
        //     //     userId = this.game.winner.id;
        //     // } else { return }
        //     // console.log("userId= ", userId);
        //     return this.$store.state.user.id === this.game.winner.id ? this.game.loser.id:  this.game.winner.id
        // },
        newGame() {
            console.log("newGame");
            this.$emit('newGame')
        },

    }
})
</script>

<style scoped>

.wrapper {
  width: 400px;
  margin: auto;
  margin-top: 100px;
}

#newGameButton {
  width: 200px;

  color: var(--ft_cyan);
  background-color: var(--ft_dark);

  border: 1px solid var(--ft_cyan);
  border-radius: 5px;

  padding: 10px 16px;
  margin-top: 40px;
  font-size: 25px;
  font-weight: bold;
}

#newGameButton:hover {
  color: var(--ft_dark);
  background-color: var(--ft_cyan);
  border-color: var(--ft_cyan);
}

#newGameButton:active {
  transform: translateY(1px);
}


</style>


