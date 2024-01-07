import { INotification } from "@/api/notification";
import { defineStore } from "pinia";
import { useAPI } from "@/api";
import { useAuthStore } from "@/store/auth";

export interface IRenderedNotification {
    id: number;
    title: string;
    subtitle: string;
    avatar: string;
    date: Date;
}

export const useNotificationStore = defineStore("notif", {
    state: () => ({
        items: [] as INotification[],
    }),
    getters: {
        has(): boolean {
            return this.items !== undefined;
        },
        unreadCount(): number {
            return this.items.filter((i) => !i.seen_at).length;
        }
    },
    actions: {
        set(items: INotification[]) {
            this.items = items;
        }
    }
});

export function renderNotificationItem(item: INotification): IRenderedNotification {
    if (item.action == "like") {
        return {
            id: 0,
            avatar: item.meta.user.avatar,
            date: item.created_at,
            subtitle: `${item.meta.user.name} پست ${item.subject.id} را لایک کرد.`,
            title: "لایک شدید!",
        };
    }
    return {
        id: 1,
        avatar: "/pics/laptop.jpg",
        title: item.action,
        date: item.created_at,
        subtitle: ""
    };
}

// setInterval(async () => {

//     const authStore = useAuthStore();

//     if (authStore.user) {
//         const notificatio = useAPI().getNotifications({ user: authStore.user });
//     }

// }, 300000);