import sequelize from '../../src/db/connection';
// import your Sequelize models so Sequelize knows they exist before syncing
import { User, Habit, Entry } from '../../src/db/schema'; 

export default async function setup() {
  console.log('🗄️  Setting up test database (Sequelize)...');

  try {
    // Authenticate connection
    await sequelize.authenticate();

    // force: true drops all tables matching initialized models, then recreates them fresh
    console.log('🚀 Syncing clean database schema...');
    await sequelize.sync({ force: true });

    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }

  // Vitest Teardown function (runs after ALL test files complete)
  return async () => {
    console.log('🧹 Tearing down test database...');

    try {
      // Option A: Drop all tables completely at the end
      await sequelize.drop(); 
      console.log('✅ Test database teardown complete');
      
      // Close the connection pool so Vitest can exit cleanly without hanging
      await sequelize.close();
      
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error);
    }
  };
}