import {Router} from 'express';
import {validateBody}from '../middleware/validation.ts';
import {register,login} from '../controller/authController.ts';
import {z} from 'zod';
const router = Router();
import {authenticateToken} from '../middleware/auth.ts';

export const insertUserSchema = z.object({
  email: z.email(),
  userName: z.string().min(3).max(50),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

router.post('/register', validateBody(insertUserSchema),   register) 
console.log('Auth routes loaded successfully');

router.post('/login', validateBody(loginSchema),login) 

export default router;