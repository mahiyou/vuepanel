<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" color="primary" prepend-icon="mdi-dots-horizontal" class="table-edit-btn"
                v-bind="props">{{ $t("actions") }}</v-btn>
        </template>
        <v-list :items="tableRowAction" item-title="title"></v-list>
    </v-menu>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        tableRowAction: Array
    }
})
</script>
<style lang="scss">
.table-edit-btn {
    font-size: 12px;
}

.v-list-item-title {
    font-size: 13px;
}

.v-list-item__overlay {
    --v-theme-overlay-multiplier: 0;
}

.v-list-item__prepend {
    width: 25px;
}
</style>