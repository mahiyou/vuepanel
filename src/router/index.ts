import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoginView from "@/views/Auth/Login.vue";
import DashboardView from "@/views/Dashboard.vue";
import ForbiddenView from "@/views/Forbidden.vue";
import NotFoundView from "@/views/NotFound.vue";
import ResetPasswordView from "@/views/Auth/ResetPassword.vue";
import RegisterView from "@/views/Auth/Register.vue";
import UsersView from "@/views/Users/Users.vue";
import Logout from "@/views/Auth/Logout.vue";
import EditUserView from "@/views/Users/EditUser.vue"
import { useAuthStore } from "@/store/auth";
import vuetify from '../plugins/vuetify';
import DeleteUserView from '@/views/Users/DeleteUser.vue';
import ShowUserView from '@/views/Users/ShowUser.vue';
import AddUserView from '@/views/Users/AddUser.vue';
import UserTypesView from "@/views/Settings/UserTypes.vue";


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
                        path: "users",
                        children: [
                            {
                                name: "users",
                                path: "",
                                component: UsersView,
                                meta: {
                                    ability: "dnj\\AAA\\Contracts\\IUser@viewAny"
                                }
                            },
                            {
                                name: "showUser",
                                path: "show/:id",
                                component: ShowUserView,
                                meta: {
                                    ability: "dnj\\AAA\\Contracts\\IUser@view"
                                }
                            },
                            {
                                name: "editUser",
                                path: "edit/:id",
                                component: EditUserView,
                                meta: {
                                    ability: "dnj\\AAA\\Contracts\\IUser@update"
                                }
                            },
                            {
                                name: "deleteUser",
                                path: "delete/:id",
                                component: DeleteUserView,
                                meta: {
                                    ability: "dnj\\AAA\\Contracts\\IUser@destroy"
                                }
                            },
                            {
                                name: "addUser",
                                path: "add",
                                component: AddUserView,
                                meta: {
                                    ability: "dnj\\AAA\\Contracts\\IUser@store"
                                }
                            }

                        ]

                    },
                    {
                        path: "settings",
                        children: [
                            {
                                name: "userTypes",
                                path: "userTypes",
                                component: UserTypesView,
                            },
                        ]
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
