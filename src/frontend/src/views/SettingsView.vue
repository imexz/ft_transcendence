<template>
  <Toast v-if="showToast" :msg=toastMsg :mode=toastMode />
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
          The image needs to be .jpg
        </span>
        <br/>
        <br/>     
        <ChangeUserAvatar @success="changeSuccess" @error="changeError"/>
      </div>
    </div>
    <div class="section">
      <div class="sectionHeadline"> 
        <h2>Enable 2FA</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <p>Here will be a text explaining how to use the 2FA</p>
        <EnableTwoFA/>
      </div>
    </div>
    <div class="section">
      <div class="sectionHeadline"> 
        <h2>API-Test (DEBUG ONLY!!)</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <p>lets you test api-calls and their returns</p>
        <button @click="$router.push('/api_test')">goto</button>
      </div>
    </div>
    <div class="section">
      <div class="sectionHeadline"> 
        <h2>Inspect Store Content (DEBUG ONLY!!)</h2>
      </div>
      <hr class="break"/>
      <div class="sectionContent">
        <p>prints the store content to console</p>
        <button @click="show">show Store</button>       
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import ChangeUserName from '@/components/Settings/ChangeUserName.vue';
import ChangeUserAvatar from '@/components/Settings/ChangeUserAvatar.vue';
import EnableTwoFA from '@/components/Auth/enable2fc.vue';
import Toast from '@/components/Toast.vue'
import { ref } from 'vue';
import { defineComponent } from 'vue';
import { maxLenUserName } from '@/defines';

export default defineComponent({
  components: {
    ChangeUserName,
    ChangeUserAvatar,
    EnableTwoFA,
    Toast,
  },
  data() {
    return {
      showToast : ref<boolean | null>(false),
      toastMsg : ref<string>(''),
      toastMode : ref<string>(''),
      len: maxLenUserName as number,
    }
  },
  methods: {
    show() {
      console.log(this.$store.state);
    },
    changeSuccess(msg: string) {
      this.showToast = true;
      this.toastMsg = msg;
      this.toastMode = 'success';
      setTimeout(() => this.showToast = false, 2000);
    },
    changeError(errorMsg: string) {
      this.showToast = true;
      this.toastMsg = errorMsg;
      this.toastMode = 'error';
      setTimeout(() => this.showToast = false, 2000);
    }
  }
})

</script>

<style scoped>
  .wrapper {
    width: 800px;
    margin: auto;
    display: flex;
    flex-direction: column;
    background-color: var(--ft_dark);
  }
  .wrapper h1 {
    text-align: left;
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