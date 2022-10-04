<template>
    <div class="room-input">
      <form @submit.prevent="creat">
        <input v-model="name" />
        <select v-model="access">
          <option>privat</option>
          <option>public</option> 
          <option>protected</option> 
        </select>
        <button type="submit">Create Room</button>
      </form>
    </div>    
</template>

<script lang="ts">
import VueAxios from 'axios';



export default {
    data() {
        return {
            name: '',
            access: 'public'
        }
    },
    methods: {
        creatRoom(): void{
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
                    this.rooms.push(response.data)
                    this.$emit('success', 'creat Room')
                    console.log("succes");
                })
                .catch(error => { this.$emit('error') })
            }
        },

}
</script>