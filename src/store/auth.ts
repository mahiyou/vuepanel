import { IUser } from "@/api/authentication";
import { defineStore } from "pinia";



export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: getUserFromLocalStorage() as undefined | IUser,
        token: getTokenFromLocalStorage() as undefined | string

    }),
    getters: {
        isUserLoggedIn(): boolean {
            return this.user !== undefined;
        },
    },
    actions: {
        hasAbility(ability: string): boolean {
            return this.user !== undefined && this.user.type.abilities.includes(ability); 
        },
        setUser(user: IUser | undefined) {
            this.user = user;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user");
            }
        },
        setToken(token: string | undefined) {
            this.token = token;
            if (token) {
                localStorage.setItem("token", JSON.stringify(token));
            } else {
                localStorage.removeItem("token");
            }
        },
    }
});

function getTokenFromLocalStorage(): undefined | string {
    const token = localStorage.getItem("token")
    if (token) {
        return JSON.parse(token);
    } else {
        return undefined;
    }
}
function getUserFromLocalStorage(): undefined | IUser {
    const user = localStorage.getItem("user")
    if (user) {
        return JSON.parse(user);
    } else {
        return undefined;
    }
}
