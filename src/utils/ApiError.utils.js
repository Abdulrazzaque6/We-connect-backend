export class ApiError extends Error {
    constructor(statusCode = 400,
        message = 'something went wrong',
        errors = [],
        stack = ""
    ) {
        super(message)
        this.message    = message,
        this.errors = errors,
        this.statusCode = statusCode,
        this.success = false,
        this.data = null

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}