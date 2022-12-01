<template>
  <div id="content">
    <div id="banner">
      <div id="bannerName">ScoreBoard</div>
    </div>
    <div id="scoreBoard">
      <div class="userEntrys columNames">
        <div class="columName">Place</div>
        <div class="columName">Wins</div>
        <div class="columName" style="border-right: none;">User</div>
      </div>
      <div class="scoreList">
        <div v-for="(user, index) in orderedUsers()" class="userEntrys">
          <div class="leftElem">{{ index + 1 }}</div>
          <div class="leftElem">{{ user.winns }}</div>
          <UserSummary :user = user as User />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import User from '@/models/user';
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            users : [] as User[]
        }
    },
    components: {
        UserSummary,
    },
    methods: {
      orderedUsers() {
        return this.users.sort((n1,n2) => {
          if (n1.winns > n2.winns) {
              return -1;
          }
          if (n1.winns < n2.winns) {
              return 1;
          }
          return 0;
        })
      },
        getData() {
        VueAxios({
            url: '/users/allUserWinnes',
            baseURL: API_URL,
            method: 'GET',
            withCredentials: true,
        })
        .then(response => { this.users = response.data})
        .catch(e => this.$store.dispatch('triggerToast', {msg: "Could not load", mode: "error", show: true}))
        }
    },
    mounted() {
        this.getData()
    }
})
</script>

<style scoped>

#content {
  width: 800px;
  height: 1073px;

  margin: auto;
  margin-top: 70px;
  margin-bottom: 80px;

  border: 2px solid var(--ft_cyan);
  border-radius: 10px;

  /* background-image: linear-gradient(0deg, var(--ft_dark), var(--ft_cyan)); */
}

#banner {
  width: 100%;
  height: 250px;

  background: url(@/assets/victoryPanda.png);
  background-size: cover;
  background-position: 150px 680px;

  border-radius: 10px 10px 0px 0px;

  border-bottom: 2px solid var(--ft_cyan);

  position: relative;
}

#bannerName {
  position: absolute;
  left: 0px;
  top: 60%;

  background-color: var(--ft_dark);

  font-size: 30px;
  font-weight: bold;

  padding: 10px;
  border: 1px solid var(--ft_cyan);
  border-left: none;
  border-radius: 0px 5px 5px 0px ;

  animation: slideOut 200ms ease-in-out forwards;
  transform-origin: left center; 
}

@keyframes slideOut {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

#scoreBoard {
  height: 740px;
  margin: 40px;
  border: 2px solid var(--ft_pink);
  background-color: var(--ft_dark);
}
.scoreList {
  height: 685px;
  overflow-y: scroll;
}
.userEntrys {
  display: grid;
  grid-template-columns: 70px 70px auto;
  grid-template-rows: auto;
  align-items: center;

  font-size: 25px;
  font-weight: bold;

  border-bottom: 1px solid var(--ft_pink);
}

.columName {
  padding-top: 10px;
  padding-bottom: 10px;
  border-right: 1px solid var(--ft_pink);
}

.leftElem {
  height: 100%;
  
  display: flex;
  align-items: center;
  justify-content: center;

  border-right: 1px solid var(--ft_pink);
}

</style>

