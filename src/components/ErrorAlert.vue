<template>
    <v-alert class="my-2" v-if="error" :text="error.message" type="error" variant="tonal" :closable="error.closable === undefined || error.closable"></v-alert>
</template>
<script lang="ts">
import { IErrorInComponent } from '@/utilities/error';
import { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        error: {
            type: Object as PropType<IErrorInComponent>,
        }
    },
})
</script>