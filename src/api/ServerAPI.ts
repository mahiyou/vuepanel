import { IAPI } from "@/api";
import { IChangeUserPasswordRequest, IGetUserTypeResponse, ISearchUserRequest, ISearchUserResponse, ISearchUserTypeRequest, ISearchUserTypeResponse, IUserActivity, IUserCreateRequest, IUserUpdateChangesRequest } from "./users";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IResetPasswordRequest, IResetPasswordResponse, IChangePasswordRequest, IUser, IUserSummary, UserStatus } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import MockAPI from "./MockAPI";
import vuetify from '../plugins/vuetify';
import { useAuthStore } from "@/store/auth";
import InputValidationError from "./errors/InputValidationError";
import BaseError from "./errors/BaseError";
import { generateServerError } from "./errors/GenerateServerError";


export default class ServerAPI extends MockAPI implements IAPI {
    protected baseURL: string;

    public constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }
    public getToken(): string {
        const token = useAuthStore().token
        if (token !== undefined) {
            return "Bearer "+token
        } else {
            throw new Error("no user")
        }
    }
    public prepaireData(request: any): Record<string, string> {
        const result: Record<string, string> = {};

        for (const key in request) {
            const value = request[key];
            if (value !== undefined) {
                result[key] = value.toString();
            }

        }
        return result;
    }
    public normalizeUserStatus(status: string): UserStatus {
        if (status === 'ACTIVE') return UserStatus.ACTIVE;
        return UserStatus.SUSPENDED;
    }
    public normalizeUserSummary(response: any): IUserSummary {
        return {
            ...response,
            status: this.normalizeUserStatus(response.status),
            meta: response.meta || {},
            created_at: new Date(response.created_at),
            update_at: response.update_at !== null ? new Date(response.update_at) : null,
        }
    }
    public normalizeUser(response: any, types?: any[]): IUser {
        const userSummary = this.normalizeUserSummary(response);
        if ("type" in userSummary) {
            return userSummary as IUser;
        }
        if (types === undefined) {
            throw new Error("You didn't provide types");
        }
        return {
            ...userSummary,
            type: types.find((t) => t.id === response.type_id)
        }
    }

    public async searchUsers(request: ISearchUserRequest): Promise<ISearchUserResponse> {
        const params = new URLSearchParams(this.prepaireData(request));
        const response = await fetch(`${this.baseURL}/aaa/v1/users?${params.toString()}`, {
            headers: {
                Accept: "application/json",
                "Accept-Language": vuetify.locale.current.value,
                Authorization:  this.getToken()
            },
        });
        const body: ISearchUserResponse = await response.json();
        body.data = body.data.map((u) => this.normalizeUser(u, body.types));
        return body;
    }
    public async getUser(userID: number): Promise<IUser> {
        const response = await fetch(`${this.baseURL}/aaa/v1/users/${userID}`, {
            headers: {
                Accept: "application/json",
                "Accept-Language": vuetify.locale.current.value,
                Authorization: this.getToken()
            },
        })
        const body = await response.json();
        return this.normalizeUser(body.data);
    }
    public async editUser(request: IUserUpdateChangesRequest): Promise<IUser> {

        const formData = new FormData();
        if (request.name) {
            formData.append('name', request.name.toString())
        }
        if (request.type_id) {
            formData.append('type_id', request.type_id.toString())
        }
        if (request.status) {
            formData.append('status', request.status.toString())
        }
        if (request.meta.avatar) {
            formData.append('avatar', request.meta.avatar);
        }
        if (request.meta.banner) {
            formData.append('banner', request.meta.banner);
        }
        formData.append('_method', 'PUT')

        const response = await fetch(`${this.baseURL}/aaa/v1/users/${request.userId}`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                    Authorization:  this.getToken()
                },
            });
        const result = await response.json();
        return this.normalizeUser(result.data);
    }
    public async addUser(request: IUserCreateRequest) {
        const body = JSON.stringify({
            name: request.name,
            statue: request.status,
            type_id: request.type_id,
            usernames: request.usernames
        })


        const response = await fetch(`${this.baseURL}/aaa/v1/users`,
            {
                method: 'POST',
                body,
                headers: {
                    Accept: "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                    "Content-Type": "application/json",
                    Authorization:  this.getToken()
                },
            });
        const result = await response.json();
        return this.normalizeUser(result.data);
    }
    public async deleteUser(userID: number): Promise<any> {
        const response = await fetch(`${this.baseURL}/aaa/v1/users/${userID}`,
            {
                method: 'DELETE',
                headers: {
                    Accept: "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                    Authorization:  this.getToken()
                },
            })
    }
    public async login(request: ILoginRequest): Promise<any> {
        const body = JSON.stringify({
            username: request.username,
            password: request.password
        })
        const response = await fetch(`${this.baseURL}/login`,
            {
                body,
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                },
            })
        return response.json();
    }
    public async register(request: IRegisterRequest): Promise<any> {
        const body = JSON.stringify({
            name: request.name,
            email: request.email,
            cellphone: request.cellphone,
            password: request.password
        });
        const response = await fetch(`${this.baseURL}/register`,
            {
                body,
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                },
            });
        if(!response.ok){
           return generateServerError(response);
        }
        return response.json();
    }
    public async searchUserTypes(request: ISearchUserTypeRequest): Promise<ISearchUserTypeResponse> {
        const params = new URLSearchParams(this.prepaireData(request));
        const response = await fetch(`${this.baseURL}/aaa/v1/types?${params.toString()}`, {
            headers: {
                Accept: "application/json",
                "Accept-Language": vuetify.locale.current.value,
                Authorization: this.getToken()
            },
        });
        return response.json();
    }
    public async getUserType(request: number): Promise<IGetUserTypeResponse> {
        const response = await fetch(`${this.baseURL}/aaa/v1/types/${request}`, {
            headers: {
                Accept: "application/json",
                "Accept-Language": vuetify.locale.current.value,
                Authorization: this.getToken()
            },
        });
        return response.json();
    }
}