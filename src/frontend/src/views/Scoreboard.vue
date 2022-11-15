<template>
    <div class="friends">
        <UserSummary
        v-for="user in orderdUsers()"
        :user = user as User ></UserSummary>
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
            users : [] as User[],
        }
    },
    components: {
        UserSummary,
    },
    methods: {
        orderdUsers() {
            return this.users.sort((n1,n2) => {
                if (n1.winnes > n2.winns) {
                    return 1;
                }

                if (n1.winns < n2.winns) {
                    return -1;
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
        .then(response => { this.users = response.data })
        .catch()
        }

    },
    mounted() {
        this.getData()
    }
})
</script>

