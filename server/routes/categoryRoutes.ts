import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getCategories);
router.post('/', verifyToken, isAdmin, upload.single('image'), createCategory);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;
