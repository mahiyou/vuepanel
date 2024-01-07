import { IAPI } from "@/api";
import { IChangePasswordRequest, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse, IResetPasswordRequest, IResetPasswordResponse } from "@/api/authentication";
import UserLoginError from "@/api/errors/UserLoginError";
import { IGetNotificationsRequest, IGetNotificationsResponse, IMarkNotificationsAsReadRequest, INotification } from "./notification";
import ServerInternalError from "./errors/ServerInternalError";

export class MockAPI implements IAPI {
    public getNotificationsItems(): INotification[] {
        return [{
            meta: {
                user: {
                    id: 40,
                    name: "علی اصغر",
                    avatar: "https://files.virgool.io/upload/users/2123818/avatar/WNZLo4.jpg?width=256"
                }
            },
            created_at: new Date(1683369808),
            seen_at: undefined,
            action: "like",
            subject: {
                type: "photo",
                id: 30,
            },
        },
        {
            meta: "system",
            created_at: new Date(1688640208),
            seen_at: new Date(1704550408),
            action: "service expired",
            subject: {
                type: "service",
                id: 51,
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
                    token: "ddd",
                    abilities: ["addProduct"],
                    name: " الکس",
                    avatar: "/pics/avatar.jpg"
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
                    token: "ddd",
                    abilities: ["addProduct"],
                    name: "الکس",
                    avatar: "/pics/avatar.jpg"
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
                        token: "ddd",
                        abilities: ["addProduct"],
                        name: "الکس",
                        avatar: "/pics/avatar.jpg"
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
        return this.call((request: IGetNotificationsRequest) => {
            if (Math.random() > 0.9) {
                throw new ServerInternalError();
            }
            return {
                notifications: this.getNotificationsItems(),
            };

        }, [request]);
    }


    private call<T extends Function>(fn: T, args: Parameters<any>): Promise<ReturnType<any>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // if (Math.random() > 0.7) {
                //     reject(new Error());
                //     return;
                // }
                try {
                    resolve(fn(...args));
                } catch (e) {
                    reject(e);
                }
            }, 2000);
        });
    }
}