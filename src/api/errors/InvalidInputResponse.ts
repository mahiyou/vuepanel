export default class InvalidInputResponse extends Error {
    errors: Record<string, string[]>;

    public constructor(errors: Record<string, string[]>) {
        super();
        this.errors = errors;
    }
}