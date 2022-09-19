<template>
    <div>
        <span>{{room.name}}</span>
        <button @click="join" > Join</button>
    </div>
</template>

<script lang="ts">

  import Room from '@/models/room';
import { Options, Vue } from 'vue-class-component';

    @Options ({
        props: {
            room: Object
        }
    })

    export default class RoomSummary extends Vue {
        room!: Room; 
        join(): void {

        }


    }

</script>

<style scoped>
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      vertical-align: middle;
      padding: 10px;
      display: inline-block;
    }
    span {
      vertical-align: middle;
      /* padding: 50px; */
      display: inline-block;
      font-size: 30px;
      width: 200px;
    }
    div {
      text-align: left;
      border: 5px solid;
      border-image-slice: 1;
      border-image-source: linear-gradient(var(--ft_pink), var(--ft_blue));
    }
    button {
      vertical-align: middle;
    }
  </style>

