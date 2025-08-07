import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
    public status: number;
    public isOperational: boolean;

    constructor(message: string, status: number = 500, isOperational: boolean = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = err;

    // Convert generic errors to AppError
    if (!(error instanceof AppError)) {
        error = new AppError(
            error.message || 'Internal Server Error',
            500,
            false
        );
    }

    const appError = error as AppError;

    // Log the error
    const logMessage = `${req.method} ${req.originalUrl} - ${appError.message}`;
    
    if (appError.status >= 500) {
        logger.error(logMessage, 'ERROR');
        if (appError.stack && process.env.NODE_ENV !== 'production') {
            logger.error(appError.stack, 'STACK');
        }
    } else {
        logger.warn(logMessage, 'CLIENT_ERROR');
    }

    // Send error response
    const response: any = {
        success: false,
        message: appError.message,
        status: appError.status,
    };

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production' && appError.stack) {
        response.stack = appError.stack;
    }

    res.status(appError.status).json(response);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`, 'CRITICAL');
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught Exception: ${error.message}`, 'CRITICAL');
    process.exit(1);
});