import { Router } from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/reportController';
import { verifyToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);
router.get('/sales', verifyToken, isAdmin, getSalesReport);

export default router;
