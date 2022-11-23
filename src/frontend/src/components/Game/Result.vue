<template>
    <user-summary :user= this.game.winner />
    <h1> won against </h1>
    <user-summary :user=this.game.loser />
    <div>
        <!-- <button @click="this.askForRematch"> ask for rematch </button> -->
        <button @click="this.newGame"> new game</button>
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


