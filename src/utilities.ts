import { useI18n } from "vue-i18n";

interface ILanguage{
    title:string,
    value:string
}

export function persianNumber(n: number | string): string {
    let result = n.toString();
    const farsiNum = "۰۱۲۳۴۵۶۷۸۹";

    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(i.toString(), "g");
        result = result.replace(regex, farsiNum.charAt(i));
    }

    return result;
}



export function getCountryCode(languages: ILanguage[],locale: string): string {
    if (locale.length == 5) {
        return locale.substring(3);
    }
    const language = languages.find((l) => l.value.substring(0, 2) == locale);
    if (!language) {
        throw new Error();
    }
    return getCountryCode(languages,language.value);
}

export function getTimeDifference(date: Date): string {
    if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30 * 12)) !== 0) {
        return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30 * 12))) + " " + useI18n().t('user.creat-at.years-ago');
    }
    if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)) !== 0) {
        return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))) + " " + useI18n().t('user.creat-at.months-ago');
    }
    if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)) !== 0) {
        return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))) + " " + useI18n().t('user.creat-at.days-ago');
    }
    if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)) !== 0) {
        return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))) + " " + useI18n().t('user.creat-at.hours-ago');
    }
    return useI18n().t('user.creat-at.recently')
}