<template>
    <div class="message">
        <div class="message_outer">
            <div class="message_avatar"></div>
            <div class="message_inner">
                <div class="message__bubble">       
                    <!-- {{ message.user.unique_name }}: {{ message.content}} -->
                    {{ message.content}}
                </div>
                <div class="message__actions"></div>
                <div class="message__spacer"></div>
            </div>
        </div>
    </div>
    
</template>

<!-- v-if="message.user.id == this.$store.getters.getUser.id" -->
<!-- <div class="messages1" v-else >       
    {{ message.user.unique_name }}: {{ message.content}}
</div> -->
<script lang="ts">
import Message from '@/models/message'

    export default {
      props: {
        message: Message
      },
    }

</script>

<style>
.message__outer {
    display: flex;
}

.message__inner {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
}

.message__actions {
    width: 67px;
    padding-right: 5px;
}

.message__spacer {
    flex: 1;
}

.message__bubble {
    max-width: calc(100% - 67px);
    overflow-wrap: break-word;
    padding: 8px;
    border: 2px solid green;
    background-color: white;
    border-radius: 8px;
    margin: 2px;
}

.message__actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 67px;
    padding-right: 5px;
}

.message__avatar {
    padding-left: 6px;
    padding-right: 8px;
}




</style>