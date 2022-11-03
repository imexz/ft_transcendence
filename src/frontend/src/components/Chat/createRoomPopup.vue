<template>
  <div class="popUp">
    <div class="headLineWrapper">
      <div class="headLine">Create a Chatroom</div>
      <button class="exitButton" @click="closePopUp">
        <font-awesome-icon icon="fa-solid fa-x" />
      </button>
    </div>
    <createRoom @actions="reEmit"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import createRoom from './createRoom.vue';

export default defineComponent({
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
})
</script>

<style scoped>
  .popUp {    
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 300px;
    width: 400px;
    height: 230px;
    background-color: var(--ft_dark);
    border: 1px solid var(--ft_cyan);
    border-radius: 10px;
    z-index: 10;

  }

  .headLineWrapper {
    margin-top: 15px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid var(--ft_cyan);
    display: flex;
    justify-content: space-between;
  }

  .headLine {
    font-size: 25px;
    font-weight: bold;
  }

  .exitButton {
    height: 30px;
    width: 30px;
    font-weight: bold;
    padding: 3px;
    border-radius: 50%;
    border: 2px solid var(--ft_pink);
    color: var(--ft_pink);
    background-color: var(--ft_dark);
  }
  .exitButton:hover {
    color: var(--ft_dark);
    background-color: var(--ft_pink);
  }

</style>