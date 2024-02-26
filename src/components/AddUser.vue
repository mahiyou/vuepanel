<template class="search-user">
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn variant="flat" color="customGreen" v-bind="props" prependIcon="mdi-plus" class="ms-2" width="110px">{{
                $t("user.add") }}</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card class="py-10 px-5">
                <v-form @submit.prevent="onSubmit" class="text-start">
                    <v-card-text>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>{{ $t("user.name") }} *</span>
                            </v-col>
                            <v-col cols="10" class="pa-1"><v-text-field variant="outlined" v-model="name"
                                    :dir="$vuetify.locale.current" /></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>{{ $t("user.status") }} *</span>
                            </v-col>
                            <v-col cols="10" class="pa-1">
                                <v-select v-model="status" clearable variant="outlined" :items="statusItems"
                                    item-title="title" item-value="value"
                                    :placeholder="$t('user.status.select')"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>{{ $t("user.role") }} *</span>
                            </v-col>
                            <v-col cols="10" class="pa-1">
                                <v-select v-model="type_id" clearable variant="outlined" :items="types"
                                    :placeholder="$t('user.role.select')"></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="px-3" type="submit" color="customGreen" variant="flat">
                            {{ $t("user.add") }}
                        </v-btn>
                        <v-btn class="px-3" variant="flat" color="secondary" @click="isActive.value = false">{{
                            $t("dialog.close") }}</v-btn>
                    </v-card-actions>
                    <ErrorAlert v-if="error" :error="error" />
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>
<script lang="ts">
import { PropType, defineComponent } from "vue";
import { UserStatus, ILocalizedUserType } from "@/api/authentication";
import ErrorAlert from "@/components/ErrorAlert.vue"
import { IErrorInComponent } from "@/utilities/error";
import { IUserCreateRequest } from "@/api/users";

export default defineComponent({
    emits: ['update:title', 'submit'],
    components: {
        ErrorAlert
    },
    setup() {
        return { UserStatus }
    },
    props: {
        userTypes: {
            type: Object as PropType<ILocalizedUserType[]>,
            required: true
        }
    },
    data() {
        return {
            name: undefined as string | undefined,
            status: undefined as string | undefined,
            type_id: undefined as number | undefined,
            error: undefined as undefined | IErrorInComponent,
            statusItems: [{ title: this.$t('user.status.ACTIVE'), value: UserStatus.ACTIVE }, { title: this.$t('user.status.SUSPENDED'), value: UserStatus.SUSPENDED }],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.status && this.type_id) {
                this.error = undefined;
                const request: IUserCreateRequest = {
                    name: this.name,
                    status: this.status,
                    type_id: this.type_id
                };
                this.$emit("submit", request);
            } else {
                this.error = {
                    message: this.$t('field.fill.essential')
                };
                return;
            }
        },
    },
    computed: {
        types(): Array<{ value: number, title: string }> {
            return this.userTypes.map((type) => {
                return { value: type.id, title: type.title }
            })
        }
    }
})
</script>