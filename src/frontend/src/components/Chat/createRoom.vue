<template>
    <div class="room-input">
        <div v-if="roomName == ''" class="elem">
          <input v-model="name" placeholder="Enter the name"/>
        </div>
        <div class="elem">
          <select class="elem2" v-model="access">
            <option :value="Access.private">privat</option>
            <option :value="Access.public">public</option>
            <option :value="Access.protected">protected</option>
          </select>
        </div>
        <div class="elem">
          <input v-if="access == Access.protected"  v-model="password" placeholder="Enter your password">
        </div>
        <div v-if="roomName == ''" class="btn">
          <button class="elem2" type="submit" @click="createOrChangeRoom">Create Room</button>
        </div>
        <div v-else>
          <button class="elem2" type="submit" @click="createOrChangeRoom">Change Room</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Access } from '@/models/room';


export enum roomReturn {
    created,
    changed
}

export default defineComponent({
  data() {
      return {
          name: '',
          access: Access.public as Access,
          password: null,
          Access
      }
  },
  mounted () {
    console.log("romName = ", this.roomName);
    console.log("roomAccess = ", this.roomAccess);
    this.access = this.roomAccess
  },
  props: {
    roomName: {
      type: String,
      default: ''
    },
    roomAccess: {
      type: Number,
      default: 0
    },
  },
  methods: {
    createOrChangeRoom(): void{
      console.log("createRoom", this.roomName, this.name);
      this.$store.state.chat.socketChat.emit('createOrChangeRoom', {roomName: this.name? this.name : this.roomName, access: this.access, password: this.password},
        response => {

          if(response.chatroom != undefined)
          {
            switch (response.info) {
              case roomReturn.created:
                console.log(response);
                this.$emit('actions', 'success');
                break;
              case roomReturn.changed:
                this.$emit('actions', 'success');

                break;
              default:
                console.log("hit default in createOrChangeRoom");

                break;
            }
          }
          else
          {
            console.log("response was null");
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