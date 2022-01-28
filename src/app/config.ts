import { environment } from "../environments/environment";
export class Config {
    baseUrl: string = 'https://jsonplaceholder.typicode.com'
    constructor() {}

    getBaseURL() {
        return this.baseUrl
    }
}