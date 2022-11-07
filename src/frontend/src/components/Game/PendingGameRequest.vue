<template>
    <div class="gameInvitePopUp">
        <h4>You have a pending game request</h4>
		<button @click="cancelInvite">Cancel</button>
        <!-- <UserSummary :user = this.$store.state.gameRequest /> -->
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue'
  import UserSummary from '../Profile/UserSummary.vue'

  export default defineComponent({
      components: {
          UserSummary,
      },
	  methods: {
		cancelInvite() {
			this.$store.state.socketGame.emit('leaveGame')
			this.$store.state.pendingRequest = false
			this.$store.state.game = null
			this.$store.state.winner = null
			this.$store.state.showGame = false
			this.$router.push('/')
		}
	  },
  })
  </script>

  <style scoped>
  .gameInvitePopUp {
    position: absolute;
    left: 0px;
    top: -151px;
    width: 324px;
    padding: 10px;
    background-color: var(--ft_dark);
    color: var(--ft_cyan);
    border-radius: 10px;
    border: 2px solid var(--ft_cyan);
  }
  .gameInvitePopUp h4 {
    margin: 2px;
  }
  </style>
