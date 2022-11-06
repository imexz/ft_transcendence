<template>
    <h1> The winner is </h1>
    <user-summary :user=winner />
    <div>
        <!-- TODO: add function to @click -->
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
        winner: User
    },
    components: {
        UserSummary
    },
	unmounted() {
		console.log("result.vue unmounted");
		// this.leaveRoom();
	},
    methods: {
		leaveRoom() {
			this.$store.state.socketGame.emit('leaveRoom')
		},
		askForRematch() {
			console.log("askForRematch");
			this.$emit('newGame');
		},
        newGame() {
            console.log("newGame");
			// this.leaveRoom()
            this.$emit('newGame')
        }
    }
})
</script>


