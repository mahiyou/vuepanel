import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoginView from "@/views/Auth/Login.vue";
import DashboardView from "@/views/Dashboard.vue";
import ForbiddenView from "@/views/Forbidden.vue";
import NotFoundView from "@/views/NotFound.vue";
import ResetPasswordView from "@/views/Auth/ResetPassword.vue";
import RegisterView from "@/views/Auth/register.vue";
import { useAuthStore } from "@/store/auth";

const routes = [
    {
        path: "/auth/",
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
        ],
    },
    {
        path: "/forbidden",
        name: "forbidden",
        component: ForbiddenView,
    },
    {
        path: "/",
        component: DefaultLayout,
        children: [
            {
                path: "",
                name: "dashboard",
                component: DashboardView,
            },

            {
                path: "users/edit",
                component: DashboardView,
                meta: {
                    ability: "users-edit"
                }
            }
        ]
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});
router.beforeEach((to) => {
    const needsAuthentication = (to.meta.authenticaion === undefined || to.meta.authenticaion === true);
    const authStore = useAuthStore();
    if (needsAuthentication) {
        if (!authStore.isUserLoggedIn) {
            return {
                name: "login",
                query: { redirect: to.fullPath },
            };
        }
        if (to.meta.ability && !authStore.hasAbility(to.meta.ability as string)) {
            return {
                name: "forbidden",
            };
        }
    }
});

export default router;
