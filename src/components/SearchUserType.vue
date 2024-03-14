<template>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn variant="flat" color="secondary" v-bind="props" prependIcon="mdi-magnify" width="110px">{{
                $t("user-types.search") }}</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="py-sm-10 py-5 px-sm-5 px-1">
                <v-form @submit.prevent="onSubmit" class="text-start">
                    <v-card-text>
                        <v-row>
                            <v-col sm="2" cols="3" class="pa-1">
                                <div>{{ $t("user-types.id") }}</div>
                            </v-col>
                            <v-col sm="10" cols="9" class="pa-1"><v-text-field variant="outlined" v-model="id"
                                    dir="ltr" /></v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="2" cols="3" class="pa-1">
                                <span>{{ $t("user-types.title") }}</span>
                            </v-col>
                            <v-col sm="10" cols="9" class="pa-1"><v-text-field variant="outlined" v-model="title"
                                    :dir="$vuetify.locale.current" /></v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="px-3" type="submit" color="customGreen" variant="flat">
                            {{ $t("user-types.search") }}
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
import ErrorAlert from "@/components/ErrorAlert.vue"
import { IErrorInComponent } from "@/utilities/error";
import { ISearchUserTypeRequest } from "@/api/users";

export default defineComponent({
    emits: ['update:title', 'submit'],
    components: {
        ErrorAlert
    },
    data() {
        return {
            id: undefined as string | undefined,
            title: undefined as string | undefined,
            error: undefined as undefined | IErrorInComponent,
        }
    },
    methods: {
        onSubmit() {
            if (this.id || this.title) {
                this.error = undefined;
                const request: ISearchUserTypeRequest = {
                    id: this.id ? parseInt(this.id) : undefined,
                    title: this.title,
                };
                this.$emit("submit", request);
            } else {
                this.error = {
                    message: this.$t('field.fill.minimum-number')
                };
                return;
            }
        },
    },

})
</script>
<style lang="scss">
.v-field__input {
    --v-field-input-padding-top: 7px;
    --v-field-input-padding-bottom: 7px;
    --v-input-control-height: 0px;
    --v-field-padding-start: 15px;
}
</style>