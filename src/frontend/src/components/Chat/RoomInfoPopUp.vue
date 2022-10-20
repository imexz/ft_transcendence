<template>
  <div>
    <h1 v-if="admin">You are Admin</h1>
    <h1 v-else>You are User</h1>


    <h1>Users</h1>
    <div v-for="user in roomInfo?.room.users">
      <UserSummary :user=user></UserSummary>
    </div>
    <h1>Admins</h1>
    <div v-for="user in roomInfo?.room.admins">
      <UserSummary :user=user></UserSummary>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserSummary from '@/components/Profile/UserSummary.vue'


export default defineComponent({
  data() {
    return {
      room: null,
      admin: false as boolean,
    }
  },
  updated() {
    this.room = this.roomInfo?.room;
    this.admin = this.roomInfo?.isAdmin;
  },
  components: {
    UserSummary,
  },
  props: {
    roomInfo :{
      type: Object,
      default: null,
    }
  }
})

</script>


