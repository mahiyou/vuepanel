import { IAPI } from "@/api";
import { IChangePasswordRequest, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse, IResetPasswordRequest, IResetPasswordResponse, IUser, Role, Status } from "./authentication";
import UserLoginError from "@/api/errors/UserLoginError";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import ServerInternalError from "./errors/ServerInternalError";
import { IGetUserResponse } from "./users";

export class MockAPI implements IAPI {
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
    public async login(request: ILoginRequest): Promise<ILoginResponse> {
        return this.call((request: ILoginRequest): ILoginResponse => {
            if (Math.random() > 1) {
                throw new UserLoginError();
            }
            return {
                user: {
                    id: 2,
                    token: "ddd",
                    abilities: ["users-edit"],
                    name: "Alex",
                    avatar: "/pics/avatar.jpg",
                    status: Status.ACTIVE,
                    role: Role.admin
                },
                notifications: this.getNotificationsItems(),
            };
        }, [request]);
    }

    public async register(request: IRegisterRequest): Promise<IRegisterResponse> {
        return this.call((request: ILoginRequest) => {
            if (Math.random() > 0.5) {
                throw new UserLoginError();
            }
            return {
                user: {
                    id: 2,
                    token: "ddd",
                    abilities: ["users-edit"],
                    name: "الکس",
                    avatar: "/pics/avatar.jpg",
                    status: Status.ACTIVE,
                    role: Role.admin
                }
            };
        }, [request]);
    }

    public async resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse | ILoginResponse> {
        return this.call((request: IResetPasswordRequest) => {
            if (Math.random() > 0.5) {
                throw new UserLoginError();
            }
            if (request.otp) {
                return {
                    user: {
                        id: 2,
                        token: "ddd",
                        abilities: ["users-edit"],
                        name: "الکس",
                        avatar: "/pics/avatar.jpg",
                        status: Status.ACTIVE,
                        role: Role.admin
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
    public async getUsers(): Promise<IGetUserResponse> {
        return this.call(() => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
            return {
                users: [
                    {
                        avatar: "/pics/avatar.jpg",
                        name: "Alex",
                        id: 3,
                        status: 0,
                        role: Role.admin,
                    },
                    {
                        avatar: "/pics/avatar2.jpg",
                        name: "Ali",
                        id: 13,
                        status: 1,
                        role: Role.user,
                    },
                    {
                        name: "Maryam",
                        id: 14,
                        status: 0,
                        role: Role.user,
                    },
                    {
                        name: "Ehsan",
                        id: 144,
                        status: 0,
                        role: Role.user,
                    },
                    {
                        name: "Roya",
                        id: 22,
                        status: 1,
                        role: Role.user,
                    }
                ]
            }

        }, [])

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