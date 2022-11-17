<template>
  <div v-if="this.dataRdy">
    <GameSettings />
  </div>
  <div v-else>
    <PongGame />
  </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import GameSettings from '../components/Game/GameSettings.vue';
  import PongGame from '../components/Game/PongGame.vue';
  
  export default defineComponent({
    data() {
      return {
        dataRdy: false as boolean
      };
    },
    async mounted() {
      console.log("in mounted gameMenu");
      await this.askBackendForGame()
      this.dataRdy = true
    },
    methods: {
      async askBackendForGame() {
        while (!this.$store.state.socketGame) {
          await new Promise(r => setTimeout(r, 100));
        }
        this.$store.state.socketGame.emit('hasGame', (cb) => {
          if (cb.data) {
            this.$store.state.showGame = true;
          } else {
            this.$store.state.showGame = false;
          }
        })
      },
      
    },
    components: {
      PongGame,
      GameSettings
    }
  })
  </script>
  
  <style>
  .singleOption {
    margin-top: 14px
  }
  
  .singleOption>button {
    font-size: 20px;
    width: 102px;
    margin-left: 0;
    margin-right: 0;
    margin-top: 4px;
    padding-top: 5px
  }
  
  .singleOption>button.selected {
    font-size: 20px;
    width: 102px;
    background-color: lightgray;
    color: black;
    margin-left: 0;
    margin-right: 0
  }
  </style>
  
<style scoped>

.gameWrapper {
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 800px;
}

</style>