import {SignJWT, jwtVerify} from 'jose';
import {createSecretKey} from 'crypto';
import env from '../../env.ts';



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
 
 