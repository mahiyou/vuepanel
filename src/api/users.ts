import { ILocalizedUserType, IUser, Role, Status } from "./authentication";

export interface IGetUserResponse {
    users: IUser[]
}
export interface ISearchUserRequest {
    id?: number;
    status?: Status
    name?: string;
    role?: Role;
    page?: number;
    ipp?: number;
}
export interface ISearchUserResponse {
    data: IUser[];
    types: ILocalizedUserType[];
    meta: {
        
    }
}
export interface IChangeUserPasswoerRequest{
    id: number,
    password: string
}