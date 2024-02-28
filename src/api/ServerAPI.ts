import { IAPI } from "@/api";
import { IChangeUserPasswordRequest, ISearchUserRequest, ISearchUserResponse, IUserActivity, IUserCreateRequest, IUserUpdateChangesRequest } from "./users";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse, IResetPasswordRequest, IResetPasswordResponse, IChangePasswordRequest, IUser, IUserSummary, UserStatus } from "./authentication";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import MockAPI from "./MockAPI";
import vuetify from '../plugins/vuetify';


export default class ServerAPI extends MockAPI implements IAPI {
    protected baseURL: string;

    public constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
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
                Authorization: "Bearer 12|3OBFQj0Kaax21p5QsvQiWRu4sVpy5Z0FHsyd5R6b"
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
                Authorization: "Bearer 12|3OBFQj0Kaax21p5QsvQiWRu4sVpy5Z0FHsyd5R6b"
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

        const response = await fetch(`${this.baseURL}/aaa/v1/users/${request.userId}`,
            {
                method: 'PUT',
                body: formData,
                headers: {
                    Accept: "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                    Authorization: "Bearer 12|3OBFQj0Kaax21p5QsvQiWRu4sVpy5Z0FHsyd5R6b"
                },
            });
        const result = await response.json();
        return this.normalizeUser(result.data);
    }
    public async addUser(request: IUserCreateRequest){
        const body = JSON.stringify({
            name: request.name,
            statue: request.status,
            type_id: request.type_id
        })


        const response = await fetch(`${this.baseURL}/aaa/v1/users/add`,
            {
                method: 'PUT',
                body,
                headers: {
                    Accept: "application/json",
                    "Accept-Language": vuetify.locale.current.value,
                    Authorization: "Bearer 12|3OBFQj0Kaax21p5QsvQiWRu4sVpy5Z0FHsyd5R6b"
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
                    Authorization: "Bearer 12|3OBFQj0Kaax21p5QsvQiWRu4sVpy5Z0FHsyd5R6b"
                },
            })
    }
    // public async login(request: ILoginRequest): Promise<ILoginResponse> {
    //     const body = JSON.stringify({
    //         username: request.username,
    //         password: request.password
    //     })
    //     const response = await fetch(`${this.baseURL}/login`,
    //         {
    //             body,
    //             method: 'POST',
    //             headers: {
    //                 Accept: "application/json",
    //                 "Accept-Language": vuetify.locale.current.value,
    //             },
    //         })
    //         this.getUser(1)
    //     return response.json();
    // }
}