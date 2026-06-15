import bcrypt from 'bcrypt';
import env from '../../env';

export const hashedPassword = async (password: string): Promise<string> => {
     return await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword)
}