import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { Op } from 'sequelize'

import sequelize from '../db/connection.ts'
import {Habit} from '../db/schema.ts'
import {Tag} from '../db/schema.ts'
import {HabitTag} from '../db/schema.ts'

export const createHabit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body

    const habit = await sequelize.transaction(async (transaction) => {
      const newHabit = await Habit.create(
        {
          userId: req.user.id,
          name,
          description,
          frequency,
          targetCount,
        },
        { transaction }
      )

      if (tagIds?.length) {
        await HabitTag.bulkCreate(
          tagIds.map((tagId: string) => ({
            habitId: newHabit.id,
            tagId,
          })),
          { transaction }
        )
      }

      return newHabit
    })

    return res.status(201).json({
      message: 'Habit created',
      habit,
    })
  } catch (error) {
    console.error('Create habit error:', error)

    return res.status(500).json({
      error: 'Failed to create habit',
    })
  }
}

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      frequency,
      sortBy = 'createdAt',
      order = 'DESC',
    } = req.query

    const currentPage = Number(page)
    const pageSize = Number(limit)

    const offset = (currentPage - 1) * pageSize

    const whereClause: any = {
      userId: req.user.id,
    }

    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`,
      }
    }

    if (frequency) {
      whereClause.frequency = frequency
    }

    const allowedSortFields = [
      'name',
      'frequency',
      'createdAt',
      'updatedAt',
      'targetCount',
    ]

    const finalSortField = allowedSortFields.includes(
      sortBy as string
    )
      ? (sortBy as string)
      : 'createdAt'

    const finalOrder =
      order === 'ASC' ? 'ASC' : 'DESC'

    const { rows, count } =
      await Habit.findAndCountAll({
        where: whereClause,

        include: [
          {
            model: Tag,
            through: {
              attributes: [],
            },
          },
        ],

        order: [[finalSortField, finalOrder]],

        limit: pageSize,
        offset,
      })

    return res.json({
      totalRecords: count,
      currentPage,
      totalPages: Math.ceil(count / pageSize),

      habits: rows,
    })
  } catch (error) {
    console.error('Get habits error:', error)

    return res.status(500).json({
      error: 'Failed to fetch habits',
    })
  }
}

export const updateHabit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params

    const { tagIds, ...updates } = req.body

    const habit = await sequelize.transaction(
      async (transaction) => {
        const existingHabit =
          await Habit.findOne({
            where: {
              id,
              userId: req.user.id,
            },
            transaction,
          })

        if (!existingHabit) {
          return null
        }

        await existingHabit.update(
          {
            ...updates,
            updatedAt: new Date(),
          },
          { transaction }
        )

        if (tagIds !== undefined) {
          await HabitTag.destroy({
            where: {
              habitId: id,
            },
            transaction,
          })

          if (tagIds.length > 0) {
            await HabitTag.bulkCreate(
              tagIds.map((tagId: string) => ({
                habitId: id,
                tagId,
              })),
              { transaction }
            )
          }
        }

        return existingHabit
      }
    )

    if (!habit) {
      return res.status(404).json({
        error: 'Habit not found',
      })
    }

    return res.json({
      message: 'Habit updated successfully',
      habit,
    })
  } catch (error) {
    console.error('Update habit error:', error)

    return res.status(500).json({
      error: 'Failed to update habit',
    })
  }
}

export const deleteHabit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params

    const deleted = await Habit.destroy({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!deleted) {
      return res.status(404).json({
        error: 'Habit not found',
      })
    }

    return res.json({
      message: 'Habit deleted successfully',
    })
  } catch (error) {
    console.error('Delete habit error:', error)

    return res.status(500).json({
      error: 'Failed to delete habit',
    })
  }
}