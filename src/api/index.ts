import MockAPI from "@/api/MockAPI";
import { ILoginRequest, ILoginResponse, IResetPasswordRequest, IResetPasswordResponse, IRegisterRequest, IRegisterResponse, IChangePasswordRequest, IUser, IInputUserForEdit, IEditUserResponse } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest } from "./notification";
import { IChangeUserPasswoerRequest, IGetUserResponse, ISearchUserRequest } from "./users";
import ServerAPI from "@/api/ServerAPI";

export interface IAPI {
    login(request: ILoginRequest): Promise<ILoginResponse>;
    register(request: IRegisterRequest): Promise<IRegisterResponse>;
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse>;
    changePassword(request: IChangePasswordRequest): Promise<void>;
    getNotifications(request: IGetNotificationsRequest): Promise<IGetNotificationsResponse>;
    markNotificationsAsRead(request: IMarkNotificationsAsReadRequest): Promise<IGetNotificationsResponse>;
    searchUsers(request: ISearchUserRequest): Promise<Response>;
    getUser(request: number): Promise<IRegisterResponse>;
    editUser(request: IInputUserForEdit): Promise<IEditUserResponse>;
    changeUserPassword(request: IChangeUserPasswoerRequest): Promise<void>;
    deleteUser(request: number): Promise<void>;
}

export function useAPI(): IAPI {
    return new ServerAPI(import.meta.env.VITE_SERVER_URL);
}
