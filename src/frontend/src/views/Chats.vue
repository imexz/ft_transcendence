
<template>

    <div>
      <creatRoom/>
      <Rooms/>
    </div>


</template>


<script lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import VueAxios from 'axios';
import { API_URL } from '@/models/host';
import Rooms from '../components/Chat/Rooms.vue'
import creatRoom from '../components/Chat/creatRoom.vue'

export default {
  components: {
    Rooms,
    creatRoom,
  }

}

</script>
