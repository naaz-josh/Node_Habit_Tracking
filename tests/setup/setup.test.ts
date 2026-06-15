import {createTestUser,createTestHabit} from './helpers';


describe('Setup Test Suite', () => {
  it('should create a test user and habit', async () => {
    const { user, token, rawPassword } = await createTestUser();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(token).toBeDefined();
    expect(rawPassword).toBeDefined();

    const habitData = {
      name: 'Test Habit',
      description: 'A test habit for testing',
      frequency: 'daily',
      targetCount: 1,
    };

    const habit = await createTestHabit(user.id, habitData);
    expect(habit).toHaveProperty('id');
    expect(habit.name).toBe(habitData.name);
  });
}); 