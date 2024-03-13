import InvalidInputResponse from "./InvalidInputResponse";
export async function generateServerError(response:Response) {
    interface IErrorContent {
        message: string;
        errors: Record<string, string[]>
    }
    if(response.status === 422){
        const errorContent: IErrorContent = await response.json();
        console.log(errorContent.errors.value)
        throw new InvalidInputResponse(errorContent.errors);
    }
}