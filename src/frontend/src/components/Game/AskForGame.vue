<template>
  <div class="gameInvitePopUp">
    <UserSummary :user = this.$store.state.gameRequest.user />
    <h4>wants to play a </h4>
    <h4 v-if="this.$store.state.gameRequest.settings" v-once>customized </h4>
    <h4>game</h4>
	<br>
    <button @click="accept" class="gameButton">
      <font-awesome-icon icon="fa-solid fa-check" />
    </button>
    <button @click="refuse" class="gameButton">
      <font-awesome-icon icon="fa-solid fa-x" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserSummary from '../Profile/UserSummary.vue'


enum RESPONSE {
  accept,
  refuse
}

export default defineComponent({

	components: {
        UserSummary,
    },

    methods:{
        accept() {
          this.$store.state.gameRequest.response(RESPONSE.accept)
          this.$store.state.gameRequest = null
          this.$router.push('/play')
        },
        refuse() {
          this.$store.state.gameRequest.response(RESPONSE.refuse)
          this.$store.state.gameRequest = null
        },
    }
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
.gameButton {
  color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    background-color: var(--ft_dark);
    border-radius: 5px;
    width: 30px;
    height: 30px;
    margin: 1px;
}
.gameButton:hover {
  background-color: var(--ft_cyan);
  color: var(--ft_dark);
}
.gameInvitePopUp h4 {
  margin: 2px;
  display: inline;
}
</style>
