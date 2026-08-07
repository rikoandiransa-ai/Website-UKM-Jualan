import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', verifyToken, isAdmin, upload.single('image'), createBlog);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBlog);
router.delete('/:id', verifyToken, isAdmin, deleteBlog);

export default router;
