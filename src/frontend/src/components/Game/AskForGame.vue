<template>
    <UserSummary :user = this.$store.state.gameRequest />
<h4>want to play with you</h4>
<button @click="accept"> accept </button>
<button @click="denie"> denie </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserSummary from '../Profile/UserSummary.vue'

export default defineComponent({
    components: {
        UserSummary,
    },
    methods:{
        accept(){ 
            this.$store.state.socketGame.emit("accept")
            this.$store.state.gameRequest = null
            this.$router.push('/play')
        },
        denie(){ 
            this.$store.state.socketGame.emit("denide")
            this.$store.state.gameRequest = null
        }
    }
})
</script>