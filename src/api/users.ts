import { IUser, Role, Status } from "./authentication";

export interface IGetUserResponse {
    users: IUser[]
}
export interface ISearchUserRequest {
    id?: number,
    status?: Status
    name?: string;
    role?: Role
}