import app from './server.ts';
import sequelize from './db/connection.ts';

const PORT = process.argv[2] || 3000;

async function startServer() {
  try {
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

 
    await sequelize.sync({ alter: true });
    console.log('All database tables synchronized.');


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();