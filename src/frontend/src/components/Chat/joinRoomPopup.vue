<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <input type="password" v-model="password">
            <button @click="TogglePopup()">
                Join Room
            </button>
            <button class="popup-close" @click="TogglePopup()">
                Close Popup
            </button>
        </div>
    </div>
</template>

<script lang="ts">

export default {
    props: ['TogglePopup', 'password'],
}
</script>

<style>
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.2);
        
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .popup-inner {
        background: #FFF;
        padding: 32px;
    } 
</style>