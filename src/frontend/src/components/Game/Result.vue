<template>
    <user-summary :user=winner />
    <h1> won against </h1>
    <user-summary :user=loser />
    <div>
        <button @click="askForRematch"> ask for rematch </button>
        <button @click="newGame"> new game</button>
    </div>
</template>

<script lang="ts">
import User from '@/models/user'
import { defineComponent } from 'vue'
import UserSummary from '@/components/Profile/UserSummary.vue';


export default defineComponent({
    props: {
        winner: User,
        loser: User,
    },
    components: {
        UserSummary
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
            let user: User;
            
            if (this.$store.state.user.id === this.winner.id) {
                user = this.loser;
            } else {
                user = this.winner;
            }
            this.$store.state.pendingRequest = false;
            this.$store.state.socketGame.emit('GameRequestBackend', {id: user.id}, (r) => {
                this.$store.state.winner = null;
		    })
        },
        newGame() {
            console.log("newGame");
            this.$emit('newGame')
        },
        
    }
})
</script>


