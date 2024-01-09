import { INotification } from "@/api/notification";
import { defineStore } from "pinia";

export interface IRenderedNotification {
    id: number;
    title: string;
    subtitle: string;
    avatar: string;
    date: Date;
    seen: Date | undefined;
}

export const useNotificationStore = defineStore("notification", {
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
            id: item.id,
            avatar: item.meta.user.avatar,
            date: item.created_at,
            seen: item.seen_at,
            subtitle: `${item.meta.user.name} پست ${item.subject.id} را لایک کرد.`,
            title: "لایک شدید!",
        };
    }
    return {
        id: item.id,
        avatar: "/pics/laptop.jpg",
        title: item.action,
        date: item.created_at,
        seen: item.seen_at,
        subtitle: "",
    };
}

