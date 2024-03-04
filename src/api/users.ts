import { ILocalizedUserType, IUser, UserStatus } from "./authentication";

export interface ILogSummary {
    id: number;
    event: string;
    user_id: number;
    subject_id: number | null;
    subject_type: string | null;
    ip: string;
    created_at: Date;
}

export interface ILog extends ILogSummary {
    properties: any;
    user: IUser;
}

export interface IUserActivity {
    calendar: Record<string, number>;
    logs: ILogSummary[];
}

export interface ISearchUserRequest {
    id?: number;
    status?: string;
    name?: string;
    type_id?: number;
    page?: number;
    ipp?: number;
    cursor?: string;
}

export interface ISearchUserResponse {
    data: IUser[];
    types: ILocalizedUserType[];
    meta: any
}

export interface IChangeUserPasswordRequest{
    id: number;
    password: string;
}

export interface IUserCreateRequest {
    name: string;
    type_id: number;
    usernames: string[];
    status?: string;
    meta?: any;
}

export interface IUserUpdateChangesRequest {
    userId: string;
    name?: string;
    type_id?: number;
    status?: string;
    meta?: any;
}
