<template>
    <div>{{ $t("enter the sent code") }}</div>
    <v-form @submit.prevent="$emit('submitOtp', otp)" v-model="validOtp">
        <v-otp-input dir="ltr" :length="otpDigits" autofocus height="57px" width="390px" base-color="primary"
            v-model="otp"></v-otp-input>
        <vue-countdown v-if="!sendCode && !loadingResend" class="countDown" :time="2 * 60 * 1000"
            v-slot="{ minutes, seconds }" @end="sendCode = true">
            {{ $vuetify.locale.isRtl ? persianNumber(minutes) : minutes }}:{{ $vuetify.locale.isRtl ?  persianNumber(seconds) : seconds }}
        </vue-countdown>
        <v-btn :disabled="!sendCode" :loading="loadingResend" @click="sendCode = false; $emit('submit')"
            variant="text">{{ $t("resend code") }}</v-btn>

        <div class="mt-12 mb-4">
            <v-btn class="px-0 edit-btn mx-3" width="150px" color="secondary" variant="flat"
                @click="$emit('goToEnterUsername'); otp = ''; sendCode = false;">
                {{ $t("edit username") }}
            </v-btn>
            <v-btn type="submit" class="px-2 btn mx-3" width="150px" color="primary" variant="flat"
                :disabled="otp.length != otpDigits" :loading="loadingConfirmOtp">
                {{ $t("confirm") }}
            </v-btn>
        </div>
    </v-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { persianNumber } from "@/utilities";

export default defineComponent({
    props: {
        otpDigits: Number,
        loadingResend: Boolean,
        loadingConfirmOtp: Boolean,
    },
    setup() {
        return {
            persianNumber,
        };
    },
    data() {
        return {
            validOtp: false,
            otp: "",
            sendCode: false,
        };
    }
});
</script>