import MockAPI from "@/api/MockAPI";
import { ILoginRequest, ILoginResponse, IResetPasswordRequest, IResetPasswordResponse, IRegisterRequest, IChangePasswordRequest, IUser } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest } from "./notification";
import { IChangeUserPasswordRequest, ISearchUserRequest, ISearchUserResponse, IUserActivity, IUserCreateRequest, IUserUpdateChangesRequest } from "./users";
import ServerAPI from "@/api/ServerAPI";

export interface IAPI {
    login(request: ILoginRequest): Promise<any>;
    register(request: IRegisterRequest): Promise<any>;
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse>;
    changePassword(request: IChangePasswordRequest): Promise<void>;
    getNotifications(request: IGetNotificationsRequest): Promise<IGetNotificationsResponse>;
    markNotificationsAsRead(request: IMarkNotificationsAsReadRequest): Promise<IGetNotificationsResponse>;
    searchUsers(request: ISearchUserRequest): Promise<ISearchUserResponse>;
    getUser(request: number): Promise<IUser>;
    editUser(request: IUserUpdateChangesRequest): Promise<IUser>;
    changeUserPassword(request: IChangeUserPasswordRequest): Promise<void>;
    deleteUser(request: number): Promise<void>;
    getUserActivity(userID: number): Promise<IUserActivity>;
    addUser(request: IUserCreateRequest): Promise<IUser>;
    searchUserTypes(): Promise<any>;
}

export function useAPI(): IAPI {
    return new ServerAPI(import.meta.env.VITE_SERVER_URL);
}
