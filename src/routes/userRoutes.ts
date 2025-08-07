import { Router } from 'express';
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser
} from '../controllers/userController';
import { validate, userValidation } from '../middlewares/validation';

const router = Router();

// GET /api/users - Get all users
router.get('/', getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validate(userValidation.getById), getUserById);

// POST /api/users - Create new user
router.post('/', validate(userValidation.create), createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validate(userValidation.update), updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validate(userValidation.delete), deleteUser);

export default router;