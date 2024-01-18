import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoginView from "@/views/Auth/Login.vue";
import DashboardView from "@/views/Dashboard.vue";
import ForbiddenView from "@/views/Forbidden.vue";
import NotFoundView from "@/views/NotFound.vue";
import ResetPasswordView from "@/views/Auth/ResetPassword.vue";
import RegisterView from "@/views/Auth/register.vue";
import UsersView from "@/views/Users/Users.vue";
import Logout from "@/views/Auth/Logout.vue";
import OneUserInformationView from "@/views/Users/OneUserInformation.vue"
import { useAuthStore } from "@/store/auth";
import vuetify from '../plugins/vuetify'


const routes = [
    {
        path: "/:lang",
        children: [
            {
                path: "auth",
                component: AuthLayout,
                children: [
                    {
                        path: "login",
                        name: "login",
                        component: LoginView,
                        meta: {
                            authenticaion: false,
                        }
                    },
                    {
                        path: "register",
                        name: "register",
                        component: RegisterView,
                        meta: {
                            authenticaion: false,
                        }
                    },
                    {
                        path: "resetPassword",
                        name: "resetPassword",
                        component: ResetPasswordView,
                        meta: {
                            authenticaion: false,
                        }
                    },
                    {
                        path: "logout",
                        name: "logout",
                        component: Logout,
                        meta: {
                            authenticaion: false,
                        }
                    },
                ],
            },
            {
                path: "forbidden",
                name: "forbidden",
                component: ForbiddenView,
            },
            {
                path: "",
                component: DefaultLayout,
                children: [
                    {
                        path: "",
                        name: "dashboard",
                        component: DashboardView,
                    },

                    {
                        name: "users",
                        path: "users",
                        component: UsersView,
                        meta: {
                            ability: "users-edit"
                        },
                    },
                    {
                        name: "oneUserInfo",
                        path: "user/:id",
                        component: OneUserInformationView,
                        meta: {
                            ability: "users-edit"
                        },
                    }
                ]
            },
            { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to) => {
    const needsAuthentication = (to.meta.authenticaion === undefined || to.meta.authenticaion === true);
    const authStore = useAuthStore();
    const lang = (to.params.lang as string) || "en";
    if (vuetify.locale.current.value != lang) {
        vuetify.locale.current.value = lang;
    }


    if (needsAuthentication) {
        if (!authStore.isUserLoggedIn) {
            const redirect = to.fullPath != "/" ? to.fullPath : undefined;
            return {
                name: "login",
                params: { lang },
                query: { redirect },
            };
        }
        if (to.meta.ability && !authStore.hasAbility(to.meta.ability as string)) {
            return {
                name: "forbidden",
                params: { lang },
            };
        }
    }
});

export default router;
