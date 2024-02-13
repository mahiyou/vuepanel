<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" color="primary" prepend-icon="mdi-dots-horizontal" class="table-edit-btn"
                v-bind="props">{{ $t("user.table.actions") }}</v-btn>
        </template>
        <v-list :items="tableRowAction"></v-list>
    </v-menu>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        tableRowAction: Array,
    },
    data(){
        return{
            openModal : false,
        }
    }
})
</script>