import { IAPI } from "@/api";
import { IChangePasswordRequest, ILoginRequest, ILoginResponse, IRegisterRequest, IResetPasswordRequest, IResetPasswordResponse, IUser, UserStatus } from "./authentication";
import UserLoginError from "@/api/errors/UserLoginError";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import ServerInternalError from "./errors/ServerInternalError";
import { IChangeUserPasswordRequest, IGetUserTypeResponse, ISearchUserRequest, ISearchUserTypeRequest, ISearchUserTypeResponse, IUserActivity, IUserCreateRequest, IUserUpdateChangesRequest } from "./users";

export default class MockAPI implements IAPI {
    getUserType(request: number): Promise<IGetUserTypeResponse> {
        throw new Error("Method not implemented.");
    }
    searchUserTypes(request: ISearchUserTypeRequest): Promise<ISearchUserTypeResponse> {
        throw new Error("Method not implemented.");
    }
    register(request: IRegisterRequest): Promise<any> {
        throw new Error("Method not implemented.");
    }
    login(request: ILoginRequest): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addUser(request: IUserCreateRequest): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    // public async login(request: ILoginRequest): Promise<ILoginResponse> {
    //     return this.call((request: ILoginRequest): ILoginResponse => {
    //         if (Math.random() > 0.9) {
    //             throw new UserLoginError();
    //         }
    //         if (Math.random() > 0.8) {
    //             throw new ServerInternalError();
    //         }
    //         return {
    //             user: {
    //                 id: 2,
    //                 name: "Alex",
    //                 meta: {
    //                     avatar: "/pics/avatar.jpg",
    //                 },
    //                 status: UserStatus.ACTIVE,
    //                 type_id: 2,
    //                 updated_at: null,
    //                 created_at: new Date(),
    //                 online: false,
    //                 type:{
    //                     title: "manager",
    //                     locale: "en",
    //                     id: 1,
    //                     meta: undefined,
    //                     abilities: ["dnj\\AAA\\Contracts\\IUser@viewAny", "dnj\AAA\Contracts\IUser@view", "dnj\AAA\Contracts\IUser@update", "dnj\AAA\Contracts\IUser@destroy", "dnj\\AAA\\Contracts\\IUser@create"],
    //                     children: [],
    //                     created_at: null,
    //                     updated_at: null
    //                 }
    //             },
    //             notifications: this.getNotificationsItems(),
    //         };
    //     }, [request]);
    // }
    editUser(request: IUserUpdateChangesRequest): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    private myVar = 5;
    protected ourVar = 4;
    public anybodyVar = 2;

    public getNotificationsItems(): INotification[] {
        return [{
            id: 1,
            meta: {
                user: {
                    id: 41,
                    name: "Ali",
                    avatar: "https://files.virgool.io/upload/users/2123818/avatar/WNZLo4.jpg?width=256"
                }
            },
            created_at: new Date(1683369808),
            seen_at: undefined,
            action: "like",
            subject: {
                type: "photo",
                id: 32,
            },
        },
        {
            id: 1,
            meta: {
                user: {
                    id: 41,
                    name: "Ali",
                    avatar: "https://files.virgool.io/upload/users/2123818/avatar/WNZLo4.jpg?width=256"
                }
            },
            created_at: new Date(1683369808),
            seen_at: undefined,
            action: "like",
            subject: {
                type: "photo",
                id: 32,
            },
        },
        {
            id: 2,
            meta: "system",
            created_at: new Date(1688640208),
            seen_at: new Date(1704550408),
            action: "service expired",
            subject: {
                type: "service",
                id: 51,
            },
        },
        {
            id: 3,
            meta: "system",
            created_at: new Date(1688640208),
            seen_at: new Date(1704550408),
            action: "service expired",
            subject: {
                type: "service",
                id: 54,
            },
        },
        {
            id: 4,
            meta: {
                user: {
                    id: 42,
                    name: "Ali",
                    avatar: "https://files.virgool.io/upload/users/2123818/avatar/WNZLo4.jpg?width=256"
                }
            },
            created_at: new Date(1683369808),
            seen_at: undefined,
            action: "like",
            subject: {
                type: "photo",
                id: 34,
            },
        },
        {
            id: 5,
            meta: "system",
            created_at: new Date(1688640208),
            seen_at: new Date(1704550408),
            action: "service expired",
            subject: {
                type: "service",
                id: 56,
            },
        },
        {
            id: 6,
            meta: {
                user: {
                    id: 43,
                    name: "Ali",
                    avatar: "https://files.virgool.io/upload/users/2123818/avatar/WNZLo4.jpg?width=256"
                }
            },
            created_at: new Date(1683369808),
            seen_at: undefined,
            action: "like",
            subject: {
                type: "photo",
                id: 38,
            },
        },
        {
            id: 7,
            meta: "system",
            created_at: new Date(1688640208),
            seen_at: new Date(1704550408),
            action: "service expired",
            subject: {
                type: "service",
                id: 59,
            },
        }];
    }

    // public async register(request: IRegisterRequest): Promise<IRegisterResponse> {
    //     return this.call((request: ILoginRequest) => {
    //         if (Math.random() > 0.5) {
    //             throw new UserLoginError();
    //         }
    //         return {
    //             user: {
    //                 id: 2,
    //                 name: "Alex",
    //                 meta: {
    //                     avatar: "/pics/avatar.jpg",
    //                 },
    //                 status: UserStatus.ACTIVE,
    //                 type_id: 2,
    //                 updated_at: null,
    //                 created_at: new Date(),
    //                 online: false
    //             },
    //         };
    //     }, [request]);
    // }

    public async resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse> {
        return this.call((request: IResetPasswordRequest) => {
            if (Math.random() > 0.5) {
                throw new UserLoginError();
            }
            if (request.otp) {
                return {
                    user: {
                        id: 2,
                        name: "Alex",
                        meta: {
                            avatar: "/pics/avatar.jpg",
                        },
                        status: UserStatus.ACTIVE,
                        type_id: 2,
                        updated_at: null,
                        created_at: new Date(),
                        online: false
                    },
                    notifications: this.getNotificationsItems(),
                };
            } else {
                return {
                    otp: { digits: 5 },
                };
            }

        }, [request]);
    }

    public async changePassword(request: IChangePasswordRequest): Promise<void> {
        if (Math.random() > 0.5) {
            throw new UserLoginError();
        }
    }

    public async getNotifications(request: IGetNotificationsRequest): Promise<IGetNotificationsResponse> {
        return this.call((request: IGetNotificationsRequest) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
            return {
                notifications: this.getNotificationsItems(),
            };

        }, [request]);
    }
    public async markNotificationsAsRead(request: IMarkNotificationsAsReadRequest): Promise<IGetNotificationsResponse> {
        return this.call((request: IMarkNotificationsAsReadRequest) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
            const oldData = this.getNotificationsItems();
            for (let i = 0; i < oldData.length; i++) {
                if (oldData[i].id == request.ids[0]) {
                    oldData[i].seen_at = new Date();
                }
            }
            return {
                notifications: oldData,
            };

        }, [request]);
    }
    public async searchUsers(request: ISearchUserRequest): Promise<any> {
    }
    public async getUser(request: number): Promise<any> {
        return this.call((request: number) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
            return {
                user: {
                    id: 2,
                }
            }
        }, [request])
    }

    public async changeUserPassword(request: IChangeUserPasswordRequest): Promise<void> {
        return this.call((request: IChangeUserPasswordRequest) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
        }, [request])
    }
    public async deleteUser(request: number): Promise<void> {
        return this.call((request: number) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
        }, [request])
    }
    getUserActivity(userID: number): Promise<IUserActivity> {
        return this.call((request: number) => {
            if (Math.random() > 0.8) {
                throw new ServerInternalError();
            }
            return {
                calendar: {
                    "2023-05-12": 20,
                    "2023-05-14": 20,
                    "2023-06-16": 20,
                    "2023-06-17": 90,
                    "2023-06-19": 50,
                    "2023-06-20": 70,
                    "2023-07-12": 20,
                    "2023-07-14": 23,
                    "2023-07-16": 70,
                    "2023-07-17": 90,
                    "2023-07-19": 50,
                    "2023-07-20": 70,
                    "2023-07-21": 20,
                    "2023-07-23": 23,
                    "2023-07-24": 70,
                    "2023-07-26": 90,
                    "2023-07-29": 50,
                    "2023-07-30": 70,
                    "2023-08-20": 70
                },
                logs: [
                    {
                        id: 1,
                        event: "login",
                        user_id: 1,
                        subject_id: null,
                        subject_type: null,
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 2,
                        event: "edit-profile",
                        user_id: 1,
                        subject_id: 2,
                        subject_type: "user",
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 3,
                        event: "logout",
                        user_id: 1,
                        subject_id: null,
                        subject_type: null,
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 4,
                        event: "login",
                        user_id: 1,
                        subject_id: null,
                        subject_type: null,
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 5,
                        event: "edit-profile",
                        user_id: 1,
                        subject_id: null,
                        subject_type: null,
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 6,
                        event: "delete-user",
                        user_id: 1,
                        subject_id: 4,
                        subject_type: "user",
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 7,
                        event: "add-user",
                        user_id: 1,
                        subject_id: 42,
                        subject_type: "user",
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    },
                    {
                        id: 8,
                        event: "reset-password",
                        user_id: 1,
                        subject_id: null,
                        subject_type: null,
                        ip: "1315:d05b:9059:24e4:4e0f:6184:35c1:e465",
                        created_at: new Date(),
                    }
                ]
            }
        }, [userID])
    }

    private call<T extends Function>(fn: T, args: Parameters<any>): Promise<ReturnType<any>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(fn(...args));
                } catch (e) {
                    reject(e);
                }
            }, 2000);
        });
    }
}
