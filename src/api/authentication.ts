import { INotification } from "./notification";
export enum Status {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}
export enum Role {
    ADMIN = "Admin",
    USER = "User",
}
export interface IUser {
    id: number,
    token: string;
    abilities: string[];
    status: Status
    name?: string;
    avatar?: string;
    role: Role,
    phoneNumber?: string,
    email?: string,
    city?: string,
    country?: string,
    zipCode?: string,
    joiningDate?: string,
    banner?:string,
}
export interface IInputUserForEdit {
    abilities?: string[];
    status?: Status
    name?: string;
    avatar?: File;
    role?: Role,
    phoneNumber?: string,
    email?: string,
    city?: string,
    country?: string,
    zipCode?: string,
    joiningDate?: string,
    banner?: File,
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

export interface IEditUserResponse{
    user: IUser;
}


