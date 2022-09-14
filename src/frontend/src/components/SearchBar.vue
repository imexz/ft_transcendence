<template>
  <div
    @focusin="active = true" 
    @focusout.stopPropagation()="active = false"
    tabindex="0"
  >
    <input 
    type="text"
    v-model="searchQuery" />
    <div>
      <UserSummary
      v-if="active"
      v-for="user in filteredUsers()"
      :user = user />
    </div>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import User from '../models/user';
  import UserSummary from './UserSummary.vue';
  import VueAxios from 'axios';


  @Options ({
    components: {
      UserSummary,
    }
  })

  export default class SearchBar extends Vue {
    searchQuery: String = '';
    active: boolean = false;
    users : User[] = [];
    filteredUsers() {
      return this.users.filter((user) => 
        user.unique_name.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
    }
    f(){
      console.log("HI")
    }
    g(){
      console.log("H)")
    }
    mounted() {
      VueAxios({
        url: '/users/allUser',
        baseURL: 'http://localhost:3000',
        method: 'GET',
        withCredentials: true,
      })
        .then(response => { this.users = response.data})
        .catch()

    }
  }
</script>