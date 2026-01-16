import express from 'express';
import { resetPassword, getAllUsers, createUser, loginUser, getUserById, updateUserById, deleteUserById, sendOTP, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', resetPassword)
router.put('/update-role/:id', updateUserRole);

export default router;