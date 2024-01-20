<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" color="primary" prepend-icon="mdi-dots-horizontal" class="table-edit-btn"
                v-bind="props">{{ $t("actions") }}</v-btn>
        </template>
        <v-list>
        <v-list-item v-for="(item , index) in tableRowAction" :key="index" :value="item.value" :title="item.title" :base-color="item.color" :prepend-icon="item.prependIcon" @click="$emit('action',{action:item.value,user: user })"></v-list-item>
        </v-list>
    </v-menu>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export interface ITableRowAction{
    title: string,
    value: string,
    prependIcon: string,
    color: string,
}
export default defineComponent({
    props: {
        tableRowAction: [] as ITableRowAction[] | any,
        user: Number
    },
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