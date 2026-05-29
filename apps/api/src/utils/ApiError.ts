export class ApiError extends Error{
    status: number
    constructor(message: any, statusCode=400){
        super(message)
        this.status = statusCode
    }
}