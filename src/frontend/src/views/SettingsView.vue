<template>
  <div class="wrapper">
    <h1>Settings</h1>
    <div class="section">
      <div class="sectionHeadline">
        <h2>Change Username</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <span>
          Your username has to be unique and at most {{ len }} characters long
        </span>
        <br/>
        <br/>
        <ChangeUserName @success="changeSuccess" @error="changeError"/>
      </div>
    </div>
    <div class="section">
      <div class="sectionHeadline">
        <h2>Change Avatar</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <span>
          The image needs to be a .jpeg file and can have a maximal size of 5MB
        </span>
        <br/>
        <br/>
        <ChangeUserAvatar @success="changeSuccess" @error="changeError"/>
      </div>
    </div>
    <div class="section">
      <div class="sectionHeadline">
        <h2>2FA</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <twoFaSettings/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import ChangeUserName from '@/components/Settings/ChangeUserName.vue';
import twoFaSettings from '@/components/Auth/2FA/twoFaSettings.vue';
import ChangeUserAvatar from '@/components/Settings/ChangeUserAvatar.vue';
import { defineComponent } from 'vue';
import { maxLenUserName } from '@/defines';

export default defineComponent({
  components: {
    ChangeUserName,
    ChangeUserAvatar,
    twoFaSettings,
  },
  data() {
    return {
      len: maxLenUserName as number,
    }
  },
  methods: {
    show() {
      //console.log(this.$store.state);
    },
    changeSuccess(msg: string) {
      this.$store.dispatch('triggerToast', {show: true, mode: 'success', msg: msg})
    },
    changeError(msg: string) {
      this.$store.dispatch('triggerToast', {show: true, mode: 'error', msg: msg})
    }
  }
})

</script>

<style scoped>
  .wrapper {
    width: 800px;
    margin: auto;
    margin-bottom: 80px;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    background-color: var(--ft_dark);
  }
  .wrapper h1 {
    margin-bottom: 40px;

  }
  .section {
    min-height: 15vh;
    margin-bottom: 30px;
    text-align: left;
  }

  .sectionHeadline {
    margin-bottom: 15px;
  }
  .sectionContent {
    margin-top: 15px;
  }
  .break {
    color: var(--ft_cyan);
    width: 100%;
    height: 1px;
    background-color: var(--ft_cyan);
    border: none;
  }

  :deep() button {
    color: var(--ft_cyan);
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    background-color: var(--ft_dark);
    padding: 5px 8px;
  }
  :deep() button:active {
    transform: translateY(1px);
  }
  :deep() button:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
  }

  :deep() input {
    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    padding: 5px 8px;
    border-color: var(--ft_cyan);
    border-radius: 5px;
  }

</style>