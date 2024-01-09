import { IUser } from "@/api/authentication";
import { defineStore } from "pinia";



export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: undefined as undefined | IUser,
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
        }
    }
});
