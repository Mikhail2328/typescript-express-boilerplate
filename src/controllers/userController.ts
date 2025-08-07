import { Request, Response, NextFunction } from 'express';
import { users, User } from '../models/user';
import { AppError } from '../middlewares/errorHandler';
import logger from '../utils/logger';

export const createUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { name, email } = req.body;
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            throw new AppError('Email already exists', 409);
        }

        const newUser: User = { 
            id: Date.now(), 
            name, 
            email,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        users.push(newUser);
        logger.info(`User created: ${newUser.email}`, 'USER');
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        next(error);
    }
};

export const getUsers = (req: Request, res: Response, next: NextFunction): void => {
    try {
        logger.info(`Retrieved ${users.length} users`, 'USER');
        
        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
            count: users.length
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = users.find((u) => u.id === id);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        
        logger.info(`Retrieved user: ${user.email}`, 'USER');
        
        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, email } = req.body;
        const userIndex = users.findIndex((u) => u.id === id);
        
        if (userIndex === -1) {
            throw new AppError('User not found', 404);
        }

        // Check if email already exists (excluding current user)
        if (email && email !== users[userIndex].email) {
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                throw new AppError('Email already exists', 409);
            }
        }

        // Update user fields
        if (name) users[userIndex].name = name;
        if (email) users[userIndex].email = email;
        users[userIndex].updatedAt = new Date();
        
        logger.info(`User updated: ${users[userIndex].email}`, 'USER');
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: users[userIndex]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const id = parseInt(req.params.id, 10);
        const userIndex = users.findIndex((u) => u.id === id);
        
        if (userIndex === -1) {
            throw new AppError('User not found', 404);
        }
        
        const deletedUser = users.splice(userIndex, 1)[0];
        logger.info(`User deleted: ${deletedUser.email}`, 'USER');
        
        res.json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        next(error);
    }
};