import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { verifyToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', verifyToken, isAdmin, updateSettings);

export default router;
