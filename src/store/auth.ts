import { IUser } from "@/api/authentication";
import { defineStore } from "pinia";



export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: undefined as undefined | IUser,
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
