import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  toggleTestimonialApproval,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getTestimonials);
router.post('/', upload.single('avatar'), createTestimonial);
router.put('/:id/approval', verifyToken, isAdmin, toggleTestimonialApproval);
router.delete('/:id', verifyToken, isAdmin, deleteTestimonial);

export default router;
