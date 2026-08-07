import { Router } from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getBanners);
router.post('/', verifyToken, isAdmin, upload.single('image'), createBanner);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBanner);
router.delete('/:id', verifyToken, isAdmin, deleteBanner);

export default router;
