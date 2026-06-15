import sequelize from './src/db/connection';
import './src/db/schema.ts';

async function main() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  const [tables] = await sequelize.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public'"
  );
  console.log('tables:', tables);
  await sequelize.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
