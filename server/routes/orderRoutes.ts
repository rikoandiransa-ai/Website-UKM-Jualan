import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  uploadPaymentProof,
} from '../controllers/orderController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/admin/all', verifyToken, isAdmin, getAllOrdersAdmin);
router.get('/:id', verifyToken, getOrderById);

router.post('/payment-proof', verifyToken, upload.single('proof_image'), uploadPaymentProof);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatusAdmin);

export default router;
