class ApiError extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    data: string;
    errors: any; // need to be updated
    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = message;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
