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