<template>
    <div class="matchInfo">
        <div>
        <UserSummary class="test"  :user=game?.playerLeft></UserSummary>
        </div>
        <div>
        vs
        </div>
        <div>
        <UserSummary class="test" ref="summ" :user=game?.playerRight></UserSummary> 
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
.matchInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 60px;
  width: 640px;
  margin: auto;
  margin-bottom: 20px;
  padding: 10px 20px 10px 20px;
  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

}

.test {
  width: 40px;
}
</style>