import { Router } from 'express';
import { getPromos, verifyPromo, createPromo, updatePromo, deletePromo } from '../controllers/promoController';
import { verifyToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getPromos);
router.post('/verify', verifyPromo);
router.post('/', verifyToken, isAdmin, createPromo);
router.put('/:id', verifyToken, isAdmin, updatePromo);
router.delete('/:id', verifyToken, isAdmin, deletePromo);

export default router;
