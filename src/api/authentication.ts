import { INotification } from "./notification";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}

interface IUsername {
    user_id: number;
    username: string;
}

export interface IUserSummary{
    id: number;
    status: UserStatus;
    name: string;
    meta: any;
    type_id: number;
    created_at: Date;
    updated_at: Date | null;
    online: boolean;
}

export interface IUser extends IUserSummary {
    type: ILocalizedUserType;
    // usernames: IUsername[];
}

export interface IUserType {
    id: number;
    meta: any;
    abilities: string[];
    children: number[];
    created_at: string | null;
    updated_at: string | null;
}

export interface ILocalizedUserType extends IUserType {
    locale: string;
    title: string;
}

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
    user: IUser;
    notifications: INotification[];
}

export interface IRegisterRequest {
    username: string;
    password: string;
}

export interface IRegisterResponse {
    user: IUserSummary;
}

export interface IResetPasswordRequest {
    username: string;
    otp?: string;
}

export interface IResetPasswordResponse {
    otp: IOTP;
}

export interface IChangePasswordRequest {
    password: string;
}

export interface IOTP {
    digits: number;
}


