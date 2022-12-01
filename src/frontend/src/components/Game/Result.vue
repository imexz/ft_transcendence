<template>
  <div class="wrapper">
    <user-summary :user=this.game.winner />
    <h1> won against </h1>
    <user-summary :user=this.game.loser />
    <div>
      <button id="newGameButton" @click="this.newGame">new game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserSummary from '@/components/Profile/UserSummary.vue';
import Game from '@/models/game';
import { Socket } from 'socket.io-client'

export default defineComponent({
  components: {
    UserSummary
  },
  props: {
    game: Game,
    socket: Socket
  },
  methods: {
    newGame() {
        console.log("newGame")
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


