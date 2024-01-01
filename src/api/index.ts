import { MockAPI } from "@/api/mock";
import { ILoginRequest, ILoginResponse, IResetPasswordRequest, IResetPasswordResponse, IRegisterRequest, IRegisterResponse, IChangePasswordRequest } from "./authentication";

export interface IAPI {
    login(request: ILoginRequest): Promise<ILoginResponse>;
    register(request: IRegisterRequest): Promise<IRegisterResponse>;
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse>;
    changePassword(request: IChangePasswordRequest): Promise<void>;
}

export function useAPI(): IAPI {
    return new MockAPI();
}
