<template>
    <div class="room-input">
      <form @submit.prevent="createRoom">
        <input v-model="name" />
        <select v-model="access" >
          <option :value="Access.private"  >privat</option>
          <option :value="Access.public" selected>public</option> 
          <option :value="Access.protected" >protected</option> 
        </select>
        <input v-if="access == Access.protected"  v-model="password" placeholder="Enter your password">
        <button type="submit">Create Room</button>
      </form>
    </div>    
</template>

<script lang="ts">
import VueAxios from 'axios';
import { API_URL } from '@/defines';
import { ref, defineComponent } from 'vue'
import { Access } from '@/models/room';

export default defineComponent({
  data() {
      return {
          name: '',
          access: Access.public as Access,
          password: '',
          Access
      }
  },
  methods: {
    createRoom(): void{
      console.log("creatRoom");            
      VueAxios({
        url: '/chatroom/creat',
        baseURL: API_URL,
        method: 'POST',
        withCredentials: true,
        data: { room_name: this.name, access: this.access, password: this.password}
      })
        .then(response => {
        console.log(response);
        if(response != null)
            console.log("success");
            this.$emit('actions', 'success');
        })
        .catch(error => { this.$emit('actions', 'error') })
      }
    },
})
</script>

<style scoped>
  button {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    background-color: var(--ft_dark);
    padding: 5px 8px;
  }
  button:active {
    transform: translateY(1px);
  }
  button:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }

  select {
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    padding: 5px 8px;
    border-color: var(--ft_cyan);
    border-radius: 5px;
  }

  input{
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    padding: 5px 8px;
    border-color: var(--ft_cyan);
    border-radius: 5px;
  }
</style>