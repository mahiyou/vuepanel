<template>
    <div class="first-page-background">
        <div class="shape">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 1440 120" fill="#f3f3f9">
                <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
            </svg>
        </div>
        <div class="bg-overlay"></div>
    </div>

    <v-container class="form-frame text-center">
        <v-row justify="center">
            <div class="text-light mb-10">
                <h1>{{ $t('user panel') }}</h1>
                <div class="sub-title font-weight-bold mt-2">{{ $t('general user panel') }}</div>
            </div>
        </v-row>
        <v-row justify="center">
            <v-col lg="5" md="6" sm="8" cols="12">
                <div class="text-end">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn variant="text" color="light" height="25px" width="30px" class="my-1" dir="ltr" rounded
                                v-bind="props"><span class="fi flag mx-1 rounded"
                                    :class="`fi-` + getCountryCode(languages, $vuetify.locale.current)" />
                                {{ $vuetify.locale.current }}</v-btn>
                        </template>
                        <v-list :elevation="3">
                            <v-list-item v-for="(language, i) in getOtherLanguages($vuetify.locale.current)" :key="i"
                                :value="language" @click="changeLanguage(language.value)">
                                <template v-slot:append>
                                    <span class="fi ms-2 rounded"
                                        :class="`fi-${getCountryCode(languages, language.value)}`" />
                                </template>
                                <v-list-item-title>{{ language.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <div class="box">
                    <RouterView />
                </div>
            </v-col>
        </v-row>
        <div class="footer">
            <div class="footer-sentence mt-3 mb-4 text-center"><span dir="ltr">&copy;{{ getYear() }}</span> {{ $t('DadeNegar Jey') }}</div>
        </div>
    </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getCountryCode } from "@/utilities";

export default defineComponent({
    setup() {
        return {
            getCountryCode,
        }
    },
    data() {
        return {
            languages: [
                { title: "English", value: "en_us" },
                { title: "فارسی", value: "fa_ir" },
            ]
        }
    },
    methods: {
        getYear() {
            const date = new Date();
            return date.getFullYear();
        },
        changeLanguage(newLang: string): void {
            newLang = newLang.substring(0, 2);
            this.$vuetify.locale.current = newLang;
            if(!this.$route.name){
                throw new Error("undefined route name");
            }
            this.$router.push({ name: this.$route.name, query: this.$route.query, params: { lang: newLang } });
        },
        getOtherLanguages(language: string) {
            return this.languages.filter((otherLanguage) => otherLanguage.value.substring(0, 2) !== language)
        }
    },
    
});
</script>
<style lang="scss">
.first-page-background {
    background-image: url("../assets/pics/first-page-image.jpg");
    background-size: cover;
    height: 400px;
    background-position: top;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 0;

    .shape {
        position: absolute;
        bottom: -12px;
        right: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
    }

    .bg-overlay {
        background: linear-gradient(90deg, #364574, #405189);
        opacity: 0.9;
        height: 400px;
    }
}

.form-frame {
    position: relative;
    top: 100px;
    z-index: 3;
    margin-bottom: 30px;

    .sub-title {
        font-size: 15px;
        color: #a4abc3;
    }

    .box {
        background-color: #fff;
        min-height: 400px;
        border-radius: 5px;
        box-shadow: 0 1px 2px rgba(56, 65, 74, .15);
        background-image: none;
        margin-bottom: 20px;
        padding: 20px;
    }

    .footer {
        font-size: 14px;

        .footer-sentence {
            color: #9294a3
        }
    }
}
</style>
