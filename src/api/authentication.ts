export interface IUser {
    token: string;
    abilities: string[];
    name?: string;
    avatar?: string;
    notifications?: number;
}

export interface ILoginRequest {
    username: string;
    password: string;
}
export interface ILoginResponse {
    user: IUser;
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
