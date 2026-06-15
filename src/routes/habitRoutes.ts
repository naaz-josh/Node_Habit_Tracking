import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middleware/validation'
import { authenticateToken } from '../middleware/auth'
import {
  createHabit,
  getHabits,
  updateHabit,
  completeHabit,
  deleteHabit,
} from '../controller/habitController'

const createHabitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  targetCount: z.number().int().positive().optional(),
})

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().int().positive().optional(),
})

const idParamSchema = z.object({
  id: z.string().uuid(),
})

const completeHabitSchema = z.object({
  note: z.string().optional(),
})

const router = Router()

router.use(authenticateToken)

router.get('/', getHabits)
router.post('/', validateBody(createHabitSchema), createHabit)
router.put('/:id', validateParams(idParamSchema), validateBody(updateHabitSchema), updateHabit)
router.post(
  '/:id/complete',
  validateParams(idParamSchema),
  validateBody(completeHabitSchema),
  completeHabit
)
router.delete('/:id', validateParams(idParamSchema), deleteHabit)

export default router
