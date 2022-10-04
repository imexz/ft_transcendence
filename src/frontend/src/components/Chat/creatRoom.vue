<template>
    <div class="room-input">
      <form @submit.prevent="creatRoom">
        <input v-model="name" />
        <select v-model="access">
          <option>privat</option>
          <option>public</option> 
          <option>protected</option> 
        </select>
        <button type="submit">Create Room </button>
      </form>
    </div>    
</template>

<script lang="ts">
import VueAxios from 'axios';
import { API_URL } from '@/defines';



export default {
    props: ['TogglePopup'],
    data() {
        return {
            name: '',
            access: 'public'
        }
    },
    methods: {
        creatRoom(): void{
            console.log("creatRoom");
            this.TogglePopup()
            
            VueAxios({
                url: '/chatroom/creat',
                baseURL: API_URL,
                method: 'POST',
                withCredentials: true,
                data: { room_name: this.name, access: this.access}
            })
                .then(response => {
                console.log(response);
                if(response != null)
                    console.log("succes");
                })
                .catch(error => { this.$emit('error') })
            }
        },

}
</script>