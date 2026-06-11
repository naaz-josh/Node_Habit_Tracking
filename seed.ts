import sequelize from './src/db/connection.ts'
import { User, Habit } from './src/db/schema';



async function seed() {
  try {
    console.log('Starting database seeding...');

    // 1. Create a Test User
    const testUser = await User.create({
      email: 'alex@example.com',
      userName: 'alex_h',
      password: 'supersecretpassword123', 
      firstName: 'Alex',
      lastName: 'Hunter'
    }) as any;
    console.log(`👤 User created with ID: ${testUser.id}`);

   
    const testHabit = await Habit.create({
      userId: testUser.id, // Links them via Foreign Key
      name: 'Drink Water',
      description: 'Drink at least 3 liters of water daily.',
      frequency: 'daily',
      targetCount: 1
    }) as any;
    console.log(`✅ Habit "${testHabit.name}" created for user!`);

    console.log('🎉 Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();