<template>
    <v-container>
        <v-card class="pa-sm-5 pa-3" flat>
            <v-data-table :headers="headers" :items="response" :items-per-page-options="[
                { value: 5, title: '5' },
                { value: 10, title: '10' },
                { value: 20, title: '20' },
                { value: -1, title: $t('all') }
            ]" :items-per-page-text="$t('items per page')" pageText="" show-current-page
                :no-data-text="$t('search.no-data')">
                <template v-slot:item.row = "{ index }">
                    <div>{{ index + 1 }}</div>
                </template>
                <template v-slot:item.abilities = "{ value }">
                    <v-chip color="primary">
                        {{ value.length }}
                    </v-chip>
                </template>

                <template v-slot:item.children = "{ value }">
                    <v-chip color="primary">
                        {{ value.length }}
                    </v-chip>
                </template>

                <template v-slot:item.actions>
                    <TableRowActions :tableRowAction="tableRowAction()" />
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>
<script lang="ts">
import { useAPI } from '@/api';
import { defineComponent } from 'vue';
import TableRowActions from "@/components/TableRowActions.vue"

export default defineComponent({
    components: {
        TableRowActions,
    },
    data() {
        return {
            response: undefined,
        }
    },
    methods: {
        async getTypes() {
            try {
                const res = await useAPI().searchUserTypes();
                this.response = res.data;
            }
            catch {

            }
        },
        tableRowAction() {
            return [
                {
                    title: this.$t("user-types.edit"),
                    value: "edit",
                    props: {
                        prependIcon: "mdi-note-edit-outline",
                        color: "blue",
                        // to: { name: `editUser`, params: { id: user.id } },
                    }

                },
                {
                    title: this.$t("user-types.delete"),
                    value: "delete",
                    props: {
                        prependIcon: "mdi-close-thick",
                        color: "red",
                        // to: { name: `deleteUser`, params: { id: user.id } },
                    }

                }
            ]
        },
    },
    mounted() {
        this.getTypes();
    },
    computed: {
        headers() {
            return [
                { key: 'row', sortable: false, title: "#" },
                { key: 'title', sortable: false, title: this.$t("user-types.title") },
                { key: 'abilities', sortable: false, title: this.$t("user-types.abilities") },
                { key: 'children', sortable: false, title: this.$t("user-types.priorities") },
                { key: 'actions', sortable: false },
            ]
        }
    }
})
</script>