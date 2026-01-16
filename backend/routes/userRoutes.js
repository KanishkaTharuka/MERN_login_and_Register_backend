import express from 'express';
import { getAllUsers, createUser, loginUser, getUserById, updateUserById, deleteUserById, sendOTP } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
router.post('/send-otp', sendOTP);

export default router;