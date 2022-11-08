<template>
    <div class="room-input">
        <div v-if="roomName == ''" class="elem">
          <input v-model="name" placeholder="Enter the name"/>
        </div>
        <div class="elem">
          <select class="elem2" v-model="access" >
            <option :value="Access.private"  >privat</option>
            <option :value="Access.public" selected>public</option>
            <option :value="Access.protected" >protected</option>
          </select>
        </div>
        <div class="elem">
          <input v-if="access == Access.protected"  v-model="password" placeholder="Enter your password">
          <!-- <input v-else v-model="password" placeholder="Not password protected" disabled> -->
        </div>
        <div v-if="roomName == ''" class="btn">
          <button class="elem2" type="submit" @click="createRoom">Create Room</button>
        </div>
        <div v-else>
          <button class="elem2" type="submit" @click="changeRoom">Change Room</button>
        </div>
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
  mounted () {
    console.log("romName = ", this.roomName);
    
  },
  props: {
    roomName: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeRoom(): void {
      this.$store.state.socketChat.emit('createRoom', {roomName: this.roomName, access: this.access, password: this.password},  // !!!!!!!!!!!!!!!
        response => {
          if(response != null) {
            console.log(response);
            console.log("success");
            // this.$emit('actions', 'success');
            console.log("rooms now", response);
          }
          else
          {
            console.error("response was null");
            this.$emit('actions', 'error');
          }
        })

    },
    createRoom(): void{
      console.log("createRoom");
      this.$store.state.socketChat.emit('createRoom', {roomName: this.name, access: this.access, password: this.password},  // !!!!!!!!!!!!!!!
        response => {
          if(response != null)
            {console.log(response);
            console.log("success");
            this.$emit('actions', 'success');
            console.log("rooms before dispatch", response);
            this.$store.dispatch('updateRooms', response);}
          else
          {
            console.error("response was null");
            this.$emit('actions', 'error');
          }
        })
      }
    },
})
</script>

<style scoped>

.elem {
  margin-top: 2px;
  height: 28px;
}

.elem2 {
  width: 200px;
}

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
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
  }

  input{
    width: 182px;
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    padding: 5px 8px;
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
  }

  .btn {
    margin-top: 20px;
  }
</style>