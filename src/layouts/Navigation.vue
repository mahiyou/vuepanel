<template>
    <v-navigation-drawer :modelValue="true" permanent :rail="drawer" color="primary">
        <h1 class="font-weight-bold text-center mt-4">
            یوزر پنل</h1>
        <v-list>
            <v-list-group v-for="(item, i) in items" :key="i" :value="item.value" :prependIcon="item.icon">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :title="item.title"  class="list-item mb-3"></v-list-item>
                </template>

                <v-list-item v-for="(option, i) in item.items" :key="i" :title="option.title" prependIcon="mdi-chevron-left"
                    :value="option.value"  class="list-item mb-3"></v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        drawer: Boolean,
    },
    data() {
        return {
            items: [
                {
                    title: "داشبورد",
                    value: "Dashboard",
                    items: [{ title: "آنالیزها", value: "Analytics" }, { title: "سی آر ام", value: "CRM" }],
                    icon: "mdi-view-dashboard-outline"
                },
                {
                    title: "احراز هویت",
                    value: "Authentication",
                    items: [{ title: "آنالیزها", value: "Analytics2" }, { title: "سی آر ام", value: "CRM2" }],
                    icon: "mdi-account-circle-outline"
                }
            ],
        };
    }
});
</script>
<style lang="scss">
.list-item {
    .v-list-item-title {
        color: #a1afdf;
    }

    .v-list-item__prepend {
        width: 35px;
    }

    .v-list-item__overlay,
    .v-ripple__container {
        display: none;
    }
}
</style>