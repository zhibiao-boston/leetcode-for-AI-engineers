import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { authenticateToken, createRateLimit } from '../middleware/auth.middleware';

const router = Router();

// Rate limiting for submission routes
const submissionRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Public routes (require authentication)
router.post('/',
  submissionRateLimit,
  SubmissionController.createSubmissionValidation,
  SubmissionController.createSubmission
);

router.get('/my-submissions',
  submissionRateLimit,
  SubmissionController.getSubmissionsValidation,
  SubmissionController.getUserSubmissions
);

router.get('/stats',
  submissionRateLimit,
  SubmissionController.getUserStats
);

router.get('/recent',
  submissionRateLimit,
  SubmissionController.getRecentSubmissions
);

router.get('/:id',
  submissionRateLimit,
  SubmissionController.getSubmissionById
);

router.put('/:id',
  submissionRateLimit,
  SubmissionController.updateSubmissionValidation,
  SubmissionController.updateSubmission
);

router.delete('/:id',
  submissionRateLimit,
  SubmissionController.deleteSubmission
);

// Admin routes
router.get('/admin/all',
  submissionRateLimit,
  SubmissionController.getSubmissionsValidation,
  SubmissionController.getAllSubmissions
);

export default router;
