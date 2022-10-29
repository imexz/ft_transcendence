<template>
  <div class="popUp1">
    <div>
      <GamePlayers :game="game" />
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
import GamePlayers from './GamePlayers.vue'
import Game from '@/models/game';

export default {
  props: {
      // game: Game
        game: {
            type: Object,
            default: null,
        }

  },
  components: {
    // GamePlayers: () => import('./GamePlayers.vue')
    GamePlayers
  },  
  methods: {
    closePopUp() {
      this.$emit('actions', 'exit')
    },
    reEmit() {
      // console.log("COM", emitMsg)
      this.$emit('actions', "test")
    }
  }
}
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