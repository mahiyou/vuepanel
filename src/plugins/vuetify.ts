/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/assets/main.scss";
// Composables
import { createVuetify } from "vuetify";
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from "vue-i18n";
import en from "../locales/en.json"
import fa from "../locales/fa.json";


const i18n = createI18n({
    locale: "fa",
    legacy: false,
    fallbackLocale: "fa",
    messages: {
        en: {
            ...en,
        },
        fa: {
            ...fa,
        }
    },
});

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    locale: {
        locale: "fa",
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    theme: {
        themes: {
            light: {
                colors: {
                    primary: "#405189",
                    secondary: "#8c8f9d",
                    customGreen: "#0ab39c",
                    customRed: "#f06548",
                    customBlue: "#558afe",
                    light: "#ffffff",
                    lightBlue: "#a1afdf",
                    textColor: "#495057"
                },
            },
        },
    },
});

export {i18n};
