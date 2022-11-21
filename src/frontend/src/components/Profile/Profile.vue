<template>
  <div class="profile" v-if="user">
    <div class="Avatar">
      <img :src='user.avatar_url' alt='Profile Pic'>
    </div>
    <div class="nameLine">
      <p>
        Profile of
      </p>
      <p>
        {{ user.username }}
      </p>
      <p style="font-size: 14px">
        {{ UserStatus[user?.userStatus] }}
      </p>
    </div>
  </div>
  <div v-if="id!=$store.state.user.id && id !='0'" class="userActions">
    <UserActionsPopup v-if="user != null" :user="user"/>
  </div>
</template>

<script lang="ts">
import User from '@/models/user';
import { API_URL } from '@/defines';
import VueAxios from 'axios';
import { defineComponent } from 'vue';
import { UserStatus } from '@/models/user';
import UserActionsPopup from '@/components/Profile/UserActionsPopup.vue';

export default defineComponent({
  data() {
    return {
      user: null as User | null,
      UserStatus: UserStatus,
    }
  },
  components: {
    UserActionsPopup,
  },
  props: {
    id: {
      type: String,
      default: "0" },
  },
  methods: {
    fetchUser(){
      let uId = (this.id != "0")?this.id:this.$store.state.user.id
      VueAxios({
          url: '/users/find/' + uId,
          baseURL: API_URL,
          method: 'GET',
          withCredentials: true,
        })
          .then(response => { this.user = response.data })
          .catch()
    }
  },
  mounted() {
    this.fetchUser();
  },
  updated() {
    if (this.user && ( parseInt(this.id) != this.user.id) )
      this.fetchUser();
  }
})

</script>

<style scoped>

  .profile {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 170px;
    background: url(@/assets/profileBackground.png);
    background-size: cover;
    background-position: 100px 800px;
    border: 2px solid var(--ft_cyan);
    border-radius: 0px 10px 10px 10px;
    border-left: none;

  }

  .nameLine {
    margin-left: 136px;
    font-size: 25px;
    font-weight: bold;
    padding-left: 10px;
    text-align: start;
    overflow: hidden;
  }

  .Avatar {
    height: 100%;
  }

  img {
    position: absolute;
    bottom: 0px;
    width: 132px;
    height: 200px;
    object-fit: cover;
    border: 2px solid var(--ft_cyan);
    border-radius: 10px 10px 0px 10px;
    border-bottom: none;
  }

  .userActions {
    position: relative;
    width: 776px;
    border: 2px solid var(--ft_cyan);
    border-radius: 10px;
    margin-top: 20px;
    padding: 10px;

  }
</style>