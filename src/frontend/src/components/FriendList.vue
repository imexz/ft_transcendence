<template>
    <div>
      <h1> Friends </h1>
        <UserSummary
        v-for="user in users"
        :user = user/>
    </div>
</template>

<script lang="ts">
import User from '@/models/user';
import { Options, Vue } from 'vue-class-component';
import UserSummary from './UserSummary.vue';
import VueAxios from 'axios';
import { hostURL } from '@/models/host';


@Options ({
    components: {
      UserSummary,
    }
  })

export default class FriendList extends Vue{

    users : User[] = [];

    mounted() {
        VueAxios({
        url: '/users/friends',
        baseURL: hostURL + ':3000',
        method: 'GET',
        withCredentials: true,
      })
        .then(response => { this.users = response.data})
        .catch()
    }

}
</script>