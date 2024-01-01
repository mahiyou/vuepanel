export function persianNumber(n: number | string): string {
    let result = n.toString();
    const farsiNum = "۰۱۲۳۴۵۶۷۸۹";

    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(i.toString(), "g");
        result = result.replace(regex, farsiNum.charAt(i));
    }

    return result;
}