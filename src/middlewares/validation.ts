import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        validationErrors.push(`Body: ${error.details.map(detail => detail.message).join(', ')}`);
      }
    }

    // Validate request params
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        validationErrors.push(`Params: ${error.details.map(detail => detail.message).join(', ')}`);
      }
    }

    // Validate request query
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        validationErrors.push(`Query: ${error.details.map(detail => detail.message).join(', ')}`);
      }
    }

    if (validationErrors.length > 0) {
      const errorMessage = `Validation failed: ${validationErrors.join('; ')}`;
      logger.warn(errorMessage, 'VALIDATION');
      
      const validationError = new AppError(errorMessage);
      validationError.status = 400;
      return next(validationError);
    }

    next();
  };
};

// Common validation schemas
export const userValidation = {
  create: {
    body: Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      name: Joi.string().min(2).max(50).optional(),
      email: Joi.string().email().optional(),
    }).min(1), // At least one field must be provided
  },
  getById: {
    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  },
};