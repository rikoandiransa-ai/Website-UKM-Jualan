import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  getAllCustomers,
} from '../controllers/authController';
import { verifyToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);

router.get('/customers', verifyToken, isAdmin, getAllCustomers);

export default router;
