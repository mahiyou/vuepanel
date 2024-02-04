<template class="search-user">
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn variant="flat" color="secondary" v-bind="props" prependIcon="mdi-magnify">{{ $t('search') }}</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="py-10 px-5">
                <v-form @submit.prevent="onSubmit" class="text-start">
                    <v-card-text>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <div>ID</div>
                            </v-col>
                            <v-col cols="10" class="pa-1"><v-text-field variant="outlined" v-model="id" dir="ltr" /></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>Name</span>
                            </v-col>
                            <v-col cols="10" class="pa-1"><v-text-field variant="outlined" v-model="name"
                                    dir="ltr" /></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>status</span>
                            </v-col>
                            <v-col cols="10" class="pa-1">
                                <v-select v-model="status" clearable variant="outlined"
                                    :items="[Status.ACTIVE, Status.SUSPENDED]" placeholder="select status"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2" class="pa-1">
                                <span>role</span>
                            </v-col>
                            <v-col cols="10" class="pa-1">
                                <v-select v-model="role" clearable variant="outlined" :items="[Role.ADMIN, Role.USER]"
                                    placeholder="select role"></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="px-2" type="submit" color="customGreen" variant="flat" @click="isActive.value = false">
                            Search
                        </v-btn>
                        <v-btn variant="flat" color="secondary" @click="isActive.value = false">Close Dialog</v-btn>
                    </v-card-actions>
                    <v-alert class="my-2" v-if="errorNoData" text="Fill in at least one field" type="error"
                        variant="tonal"></v-alert>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Role, Status } from "@/api/authentication";


export default defineComponent({
    emits: ['update:title','searchUser'],

    setup() {
        return { Status, Role }
    },

    data() {
        return {
            id: undefined,
            name: undefined,
            status: undefined,
            role: undefined,
            errorNoData: false
        }
    },
    methods: {
        onSubmit() {
            if (this.id || this.name || this.status || this.role) {
                this.errorNoData = false;
            } else {
                this.errorNoData = true;
                return;
            }
            this.$emit("searchUser", { id: this.id, name: this.name, status: this.status, role: this.role })
        },
    },
})
</script>
<style lang="scss">
.v-field__input {
    --v-field-input-padding-top: 7px;
    --v-field-input-padding-bottom: 7px;
    --v-input-control-height: 0px;
    --v-field-padding-start: 20px;
}
</style>