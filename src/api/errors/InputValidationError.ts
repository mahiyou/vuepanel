import { useI18n } from "vue-i18n";
import BaseError from "./BaseError";

export default class InputValidationError extends BaseError {
    public getLocaleMessage(): string {
        return useI18n().t("Please check your input");
    }
}
