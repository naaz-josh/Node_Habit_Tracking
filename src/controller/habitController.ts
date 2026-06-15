import type { Response } from 'express'
import { Op } from 'sequelize'
import { Habit, Entry } from '../db/schema'
import type { AuthenticatedRequest } from '../middleware/auth'

const startOfDay = (date: Date) => {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

const endOfDay = (date: Date) => {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

const findUserHabit = async (habitId: string, userId: string) => {
  return Habit.findOne({
    where: { id: habitId, userId },
  })
}

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount } = req.body
    const userId = req.user!.id as string

    const habit = await Habit.create({
      userId,
      name,
      description,
      frequency,
      targetCount,
    })

    res.status(201).json({ habit: habit.toJSON() })
  } catch (error) {
    console.error('Error creating habit:', error)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id as string

    const habits = await Habit.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json({ habits: habits.map((habit) => habit.toJSON()) })
  } catch (error) {
    console.error('Error fetching habits:', error)
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id as string
    const habit = await findUserHabit(req.params.id, userId)

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    await habit.update(req.body)

    res.status(200).json({ habit: habit.toJSON() })
  } catch (error) {
    console.error('Error updating habit:', error)
    res.status(500).json({ error: 'Failed to update habit' })
  }
}

export const completeHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id as string
    const habit = await findUserHabit(req.params.id, userId)

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    const today = new Date()
    const existingEntry = await Entry.findOne({
      where: {
        habitId: habit.getDataValue('id'),
        completionDate: {
          [Op.between]: [startOfDay(today), endOfDay(today)],
        },
      },
    })

    if (existingEntry) {
      return res.status(400).json({ error: 'Habit already completed today' })
    }

    const entry = await Entry.create({
      habitId: habit.getDataValue('id'),
      note: req.body.note,
      completionDate: today,
    })

    res.status(201).json({ entry: entry.toJSON() })
  } catch (error) {
    console.error('Error completing habit:', error)
    res.status(500).json({ error: 'Failed to complete habit' })
  }
}

export const deleteHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id as string
    const habit = await findUserHabit(req.params.id, userId)

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    await habit.destroy()

    res.status(200).json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    res.status(500).json({ error: 'Failed to delete habit' })
  }
}
