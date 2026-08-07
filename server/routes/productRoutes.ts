import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  toggleWishlist,
  getWishlists,
} from '../controllers/productController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getProducts);
router.get('/wishlist', verifyToken, getWishlists);
router.get('/:slug', getProductBySlug);

router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

router.post('/:id/reviews', verifyToken, addReview);
router.post('/wishlist/toggle', verifyToken, toggleWishlist);

export default router;
