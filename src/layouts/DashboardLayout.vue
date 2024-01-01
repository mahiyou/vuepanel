<template>

    <v-row>
        <v-col cols="2"><Navigation/></v-col>
        <v-col cols="10"><RouterView /></v-col>
    </v-row>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "@/layouts/Navigation.vue";
export default defineComponent({
    
    components:{
        Navigation,
    }
});
</script>