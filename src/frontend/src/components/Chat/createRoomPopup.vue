<template>
  <div class="popUp">
    <div>
      <h1>Create Room</h1>
    </div>
    <createRoom @actions="reEmit"/>
    <div>
      <button @click="closePopUp" >
        Close Popup
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import createRoom from './createRoom.vue';

export default {
  components: {
    createRoom,
  },
  methods: {
    closePopUp() {
      this.$emit('actions', 'exit')
    },
    reEmit(emitMsg) {
      console.log("COM", emitMsg)
      this.$emit('actions', emitMsg)
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
    top: 300px;
    width: 400px;
    height: 200px;
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