<template>
  <div class="popUp1">
    <div v-if="$store.state.game != null">
      <div v-if="userId != $store.state.game.playerRight._id">
        Playing against {{$store.state.game.playerRight.username}}
      </div>
      <div v-if="userId != $store.state.game.playerLeft._id">
        Playing against {{$store.state.game.playerLeft.username}}
      </div>
    </div>
    <div>
      <button @click="reEmit" >
        View Game
      </button>
      <button @click="closePopUp" >
        Close Popup
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Game from '@/models/game';
import User from '@/models/user';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
        userId: {
          type: Number,
          default: 0
        }

  },
  methods: {
    closePopUp() {
      this.$emit('actions', 'exit')
    },
    reEmit() {
      // console.log("COM", emitMsg)
      this.$emit('actions', "view")
    }
  }
})
</script>

<style scoped>
  .popUp {    
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 30px;
    width: 40px;
    height: 20px;
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 10px;
    z-index: 10;

    /* display: flex; */
    align-items: center;
    justify-content: center;
  }
  div {
    margin-top: 20px
  }
  button {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    background-color: var(--ft_dark);
    padding: 5px 8px;
  }
  button:active {
    transform: translateY(1px);
  }
  button:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }

</style>