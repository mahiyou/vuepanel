import { IErrorInComponent } from "@/utilities/error";

export default abstract class BaseError extends Error {
    abstract getLocaleMessage(): string;
    toComponentError(): IErrorInComponent {
        return {
            message: this.getLocaleMessage()
        }
    }
}