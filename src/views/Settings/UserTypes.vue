<template>
    <v-container class="userTypes-list">
        <v-card v-if="!loading" class="pa-sm-5 pa-3" flat>
            <v-row class="mb-3">
                <v-col sm="6" cols="12">
                    <h1
                        :class="$vuetify.display.xs ? 'text-center' : $vuetify.locale.isRtl ? 'text-right' : 'text-left'">
                        {{ $t('settings.user-types') }}
                    </h1>
                </v-col>
                <v-col sm="6" cols="12" v-if="response"
                    :align="$vuetify.display.xs ? 'center' : $vuetify.locale.isRtl ? 'left' : 'right'" class="my-auto">
                    <SearchUserType @submit="onSearchUserType" />
                    <v-btn :to="{ name: 'addUserTypes' }" variant="flat" color="customGreen" prependIcon="mdi-plus"
                        class="ms-3" width="150px">{{
            $t("user-types.add") }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-data-table :headers="headers" :items="response?.data" :items-per-page-options="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: 20, title: '20' },
            { value: -1, title: $t('all') }
        ]" :items-per-page-text="$t('items per page')" pageText="" show-current-page
                :no-data-text="$t('search.no-data')">
                <template v-slot:item.abilities="{ value }">
                    <v-chip color="primary">
                        {{ value.length }}
                    </v-chip>
                </template>

                <template v-slot:item.children="{ value }">
                    <v-chip color="primary">
                        {{ value.length }}
                    </v-chip>
                </template>

                <template v-slot:item.actions>
                    <TableRowActions :tableRowAction="tableRowAction()" />
                </template>
            </v-data-table>
        </v-card>
        <div class="text-center my-10">
            <v-progress-circular v-if="loading" indeterminate color="primary" />
        </div>
    </v-container>
</template>
<script lang="ts">
import { useAPI } from '@/api';
import { defineComponent } from 'vue';
import TableRowActions from "@/components/TableRowActions.vue";
import SearchUserType from '@/components/SearchUserType.vue';
import { ISearchUserTypeRequest, ISearchUserTypeResponse } from '@/api/users';

export default defineComponent({
    components: {
        TableRowActions,
        SearchUserType
    },
    data() {
        return {
            response: undefined as undefined | ISearchUserTypeResponse,
            loading: true,
        }
    },
    methods: {
        async getTypes(request: ISearchUserTypeRequest) {
            this.loading = true;
            try {
                const res = await useAPI().searchUserTypes(request);
                this.response = res;
            }
            catch {

            }
            finally {
                this.loading = false;
            }
        },
        onSearchUserType(request: ISearchUserTypeRequest) {
            this.$router.push({
                name: this.$route.name as string, query: {
                    id: request.id,
                    title: request.title,
                }
            });
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
    created() {
        this.$watch(
            () => this.$route.query,
            () => {
                this.getTypes({
                    id: this.$route.query.id ? parseInt(this.$route.query.id as string) : undefined,
                    title: this.$route.query.title ? this.$route.query.title as string : undefined,
                })
            },
            { immediate: true }
        )
    },
    computed: {
        headers() {
            return [
                { key: 'id', sortable: false, title: "#" },
                { key: 'title', sortable: false, title: this.$t("user-types.title") },
                { key: 'abilities', sortable: false, title: this.$t("user-types.abilities") },
                { key: 'children', sortable: false, title: this.$t("user-types.priorities") },
                { key: 'actions', sortable: false },
            ]
        }
    }
})
</script>
<style lang="scss">
.userTypes-list {
    .v-data-table-footer {
        align-items: center;
        justify-content: center;
        margin-top: 20px;

        .v-data-table-footer__items-per-page {
            padding-right: 0px;

        }
    }
}
</style>