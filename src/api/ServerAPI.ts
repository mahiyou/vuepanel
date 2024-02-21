import { IAPI } from "@/api";
import { IChangeUserPasswoerRequest, ISearchUserRequest, ISearchUserResponse } from "./users";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse, IResetPasswordRequest, IResetPasswordResponse, IChangePasswordRequest, IInputUserForEdit, IEditUserResponse } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import MockAPI from "./MockAPI";


export default class ServerAPI extends MockAPI implements IAPI {
    protected baseURL: string;

    public constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    public prepareData(request: any): Record<string, string> {
        const result: Record<string, string> = {};

        for (const key in request) {
            const value = request[key];
            if (value !== undefined) {
                result[key] = value.toString();
            }

        }
        return result;
    }

    public async searchUsers(request: ISearchUserRequest): Promise<ISearchUserResponse> {
        const params = new URLSearchParams(this.prepareData(request));
        const response = await fetch(`${this.baseURL}/aaa/v1/users?${params.toString()}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer 8|7GwCe9yXS5GDbimEbZheck9KnTS6Fwg7ujcJ6YbB"
            },
        });
        const body: ISearchUserResponse = await response.json();
        return body;
    }

}