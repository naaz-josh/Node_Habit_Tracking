import { Sequelize } from 'sequelize';
import { env, isProd } from '../../env.ts';
import { remember } from '@epic-web/remember';

const createSequelize = () => {
  return new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASSWORD,
    {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
};

let sequelize: Sequelize;

if (isProd()) {
  sequelize = createSequelize();
} else {
  sequelize = remember('sequelize', () => createSequelize());
}

export default sequelize;