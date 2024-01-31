import { MockAPI } from "@/api/mock";
import { ILoginRequest, ILoginResponse, IResetPasswordRequest, IResetPasswordResponse, IRegisterRequest, IRegisterResponse, IChangePasswordRequest } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest } from "./notification";
import { IGetUserResponse, ISearchUserRequest } from "./users";

export interface IAPI {
    login(request: ILoginRequest): Promise<ILoginResponse>;
    register(request: IRegisterRequest): Promise<IRegisterResponse>;
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse>;
    changePassword(request: IChangePasswordRequest): Promise<void>;
    getNotifications(request: IGetNotificationsRequest): Promise<IGetNotificationsResponse>;
    markNotificationsAsRead(request: IMarkNotificationsAsReadRequest): Promise<IGetNotificationsResponse>;
    searchUsers(request: ISearchUserRequest): Promise<IGetUserResponse>;
}

export function useAPI(): IAPI {
    return new MockAPI();
}
