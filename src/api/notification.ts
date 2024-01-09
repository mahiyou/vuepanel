import { IUser } from "./authentication";

export interface INotificationSubject {
    type: string;
    id: string | number;
}

export interface INotification {
    id: number;
    meta: any;
    created_at: Date;
    seen_at: Date | undefined;
    action: string;
    subject: INotificationSubject;
}
export interface IGetNotificationsRequest {
    user: IUser;
}
export interface IGetNotificationsResponse {
    notifications: INotification[];
}
export interface IMarkNotificationsAsReadRequest {
    ids: number[];
}
