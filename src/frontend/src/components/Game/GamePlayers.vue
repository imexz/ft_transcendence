<template>
  <div class="matchInfoBox">
    <div>
      <UserSummary :user=this.game?.winner></UserSummary>
    </div>
    <div class="txtVs">
      vs
    </div>
    <div>
      <UserSummary :user=this.game?.loser></UserSummary> 
    </div>   
  </div>
</template>

<script lang="ts">
import Game from '@/models/game';
import { defineComponent } from 'vue';
import UserSummary from '@/components/Profile/UserSummary.vue';

export default defineComponent({
    props: {
        // game: Game
        game: {
            type: Object,
            default: null,
        }
    },
  	components: {
      UserSummary
    //   UserSummary: () => import('../Profile/UserSummary.vue')
  	}   
})
</script>

<style scoped>
.matchInfoBox {
  width: 640px;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;

  padding: 10px 20px 10px 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

}

.txtVs{
  font-size: 60px;
}

</style>