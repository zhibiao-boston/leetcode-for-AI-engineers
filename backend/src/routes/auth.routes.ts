import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, createRateLimit } from '../middleware/auth.middleware';

const router = Router();

// Rate limiting for auth routes
const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// Public routes
router.post('/register', 
  authRateLimit,
  AuthController.registerValidation,
  AuthController.register
);

router.post('/login', 
  authRateLimit,
  AuthController.loginValidation,
  AuthController.login
);

router.post('/refresh-token', 
  authRateLimit,
  AuthController.refreshToken
);

// Protected routes (require authentication)
router.use(authenticateToken); // All routes below require authentication

router.post('/logout', AuthController.logout);

router.get('/profile', AuthController.getProfile);

router.put('/profile', 
  AuthController.updateProfileValidation,
  AuthController.updateProfile
);

router.put('/change-password', 
  AuthController.changePasswordValidation,
  AuthController.changePassword
);

router.get('/check-admin', AuthController.checkAdmin);

export default router;
