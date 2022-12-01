<template>
  <div>
    <div class="headLineWrapper">
      <div class="headLine">Spectate</div>
      <button class="exitButton" @click="closePopUp">
        <font-awesome-icon icon="fa-solid fa-x" />
      </button>
    </div>
    <div class="txt">
        Playing against {{this.userName}}
    </div>
    <div>
      <button class="btn" @click="reEmit" >
        View Game
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    userName: {
          type: String,
          default: ""
        }

  },
  methods: {
    closePopUp() {
      this.$emit('actions', 'exit')
    },
    reEmit() {
      this.$emit('actions', "view")
    }
  }
})
</script>

<style scoped>
  .btn {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    background-color: var(--ft_dark);
    padding: 5px 8px;
    margin-bottom: 10px;
  }
  .btn:active {
    transform: translateY(1px);
  }
  .btn:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
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

  .txt {
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 10px;
  }

</style>