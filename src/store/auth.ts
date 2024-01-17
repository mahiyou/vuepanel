import { IUser } from "@/api/authentication";
import { defineStore } from "pinia";



export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: getUserFromLocalStorage() as undefined | IUser,
    }),
    getters: {
        isUserLoggedIn(): boolean {
            return this.user !== undefined;
        },
    },
    actions: {
        hasAbility(ability: string): boolean {
            return this.user !== undefined && this.user.abilities.includes(ability);
        },
        setUser(user: IUser | undefined) {
            this.user = user;
            if (user) {
                localStorage.setItem("auth", JSON.stringify(user));
            }else{
                localStorage.removeItem("auth");
            }
        },
    }
});

function getUserFromLocalStorage(): undefined | IUser {
    const user = localStorage.getItem("auth")
    if (user) {
        return JSON.parse(user);
    } else {
        return undefined;
    }
}
