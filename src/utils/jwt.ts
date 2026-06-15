import {SignJWT, jwtVerify} from 'jose';
import {createSecretKey} from 'crypto';
import env from '../../env';



export interface JwtPayload {
id: number;
email: string;
username: string;
 [key: string]: any;

}

export const generateToken = async (payload: JwtPayload) => {
     const secret = env.JWT_SECRET
     const secretKey = createSecretKey( secret, 'utf-8')

     return await new SignJWT(payload)
     .setProtectedHeader({alg:'HS256'})
     .setIssuedAt()
     .setExpirationTime(env.JWT_EXPIRES_IN)
     .sign(secretKey)
}
 
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify(token, secretKey)

  return payload as unknown as JwtPayload
}
 