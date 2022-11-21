<template>
    <user-summary :user= this.game.winner />
    <h1> won against </h1>
    <user-summary :user=this.game.loser />
    <div>
        <button @click="this.askForRematch"> ask for rematch </button>
        <button @click="this.newGame"> new game</button>
    </div>
</template>

<script lang="ts">
import User from '@/models/user'
import { defineComponent } from 'vue'
import UserSummary from '@/components/Profile/UserSummary.vue';
import Game from '@/models/game';
import { io, Socket } from 'socket.io-client'



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
			this.$store.state.socketGame.emit('leaveRoom')
		},
		askForRematch() {
			console.log("askForRematch");
            let userId: number;

            if (this.$store.state.user.id === this.game.winner.id) {
                userId = this.game.loser.id;
            } else if (this.$store.state.user.id === this.game.loser.id) {
                userId = this.game.winner.id;
            } else { return }
            console.log("userId= ", userId);
            

            // const tmp_user = this.$store.state.user.id === this.game.winner.id ? this.game.loser.id:  this.game.winner.id
            this.$store.state.socketGame.emit('GameRequestBackend', {settings: undefined , id: userId}, (r) => {
                // this.$store.state.winner = null;
		    })
            this.game = null
        },
        newGame() {
            console.log("newGame");
            this.$emit('newGame')
        },

    }
})
</script>


