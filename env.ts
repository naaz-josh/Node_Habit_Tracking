import {env as loadEnv} from 'custom-env';
import {z} from 'zod'


process.env.APP_STAGE =process.env.APP_STAGE || 'dev'

export const isProduction = process.env.APP_STAGE === 'production'
export const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

if(isDevelopment){
  loadEnv()
}
else if(isTesting){
   loadEnv('test')
}


const envSchema = z.object({
    NODE_ENV:z.enum(['development', 'production', 'test'])
    .default('development'),
    APP_STAGE:z.enum(['dev', 'production', 'test']).default('dev'),

 //DB Configurations

  DB_HOST: z.string().trim().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  DB_NAME: z.string().trim().min(1),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().min(8, 'Password must be at least 8 characters'),

  // Security Configurations
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),// e.g., '1h', '30m'
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try{
    env = envSchema.parse(process.env)
}catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid environment variables:')
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))

    // Detailed error messages
    error.issues.forEach((err) => {
      const path = err.path.join('.')
      console.error(`  ${path}: ${err.message}`)
    })

    process.exit(1) // Exit with error code
  }
  throw error
}

console.log(env)
export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'


export {env}

export default env