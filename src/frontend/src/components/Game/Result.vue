<template>
    <h1> The winner is </h1>
    <user-summary :user=winner />
    <div>
        <button @click=""> ask for rematch </button>
        <button @click="newGame"> new game</button>
    </div>
</template>

<script lang="ts">
import User from '@/models/user'
import { defineComponent } from 'vue'
import UserSummary from '@/components/Profile/UserSummary.vue';


export default defineComponent({
    props: {
        winner: User
    },
    components: {
        UserSummary
    },
    methods: {
        newGame() {
            console.log("newGame");
            
            this.$emit('newGame')
        }
    }
})
</script>


