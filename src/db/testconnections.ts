import sequelize from './connection.ts';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
}

testConnection();