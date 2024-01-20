import { INotification } from "./notification";
export enum Status {
    ACTIVE,
    SUSPENDED
}
export enum Role {
    ADMIN,
    USER,
}
export interface IUser {
    id: number,
    token: string;
    abilities: string[];
    status: Status
    name?: string;
    avatar?: string;
    role: Role
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
    user: IUser;
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


