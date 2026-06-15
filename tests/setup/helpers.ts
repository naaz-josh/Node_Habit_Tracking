import sequelize from '../../src/db/connection' // Make sure this is your Sequelize instance
import { User, Habit, Entry } from '../../src/db/schema'
import { hashedPassword } from '../../src/utils/passwords'
import { generateToken } from '../../src/utils/jwt'

export async function createTestUser(userData: Partial<{
  email: string
  userName: string
  password: string
  firstName: string
  lastName: string
}> = {}) {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    userName: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    ...userData
  }

  const hashPassword = await hashedPassword(defaultData.password)
  
  const userInstance = await User.create({
    email: defaultData.email,
    userName: defaultData.userName,
    password: hashPassword,
    firstName: defaultData.firstName,
    lastName: defaultData.lastName,
  });

  const user = userInstance.toJSON();

  const token = await generateToken({
    id: user.id,
    email: user.email,
    username: user.userName,
  })

  return { user, token, rawPassword: defaultData.password }
}

export async function createTestHabit(userId: number | string, habitData: Partial<{
  name: string
  description: string
  frequency: string
  targetCount: number
}> = {}) {
  const defaultData = {
    name: `Test Habit ${Date.now()}`,
    description: 'A test habit',
    frequency: 'daily',
    targetCount: 1,
    ...habitData
  }

  // --- SEQUELIZE VERSION ---
  const habit = await Habit.create({
    userId, // Foreign key linking to the test user
    name: defaultData.name,
    description: defaultData.description,
    frequency: defaultData.frequency,
    targetCount: defaultData.targetCount,
  })

  return habit.toJSON()
}

export async function cleanupDatabase() {
  // Clean up in the right order due to foreign key constraints
  // In Sequelize, passing force: true to truncate bypasses integrity blocks and sweeps tables clean
  await Entry.destroy({ truncate: true, cascade: true })
  await Habit.destroy({ truncate: true, cascade: true })
  await User.destroy({ truncate: true, cascade: true })
}