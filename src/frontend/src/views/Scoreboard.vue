<template>
    <div class="friends">
      <div v-for="user in orderdUsers()">
        <div>Wins: {{ user.winns }}</div>
        <UserSummary :user = user as User />
      </div>
      </div>
</template>

<script lang="ts">

import User from '@/models/user';
import UserSummary from '@/components/Profile/UserSummary.vue';
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { defineComponent } from 'vue';
import { userInfo } from 'os';

export default defineComponent({
    data() {
        return {
            users : [] as User[],
            u : [],
        }
    },
    components: {
        UserSummary,
    },
    methods: {
        orderdUsers() {
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
        .catch()
        }

    },
    mounted() {
        this.getData()
    }
})
</script>

