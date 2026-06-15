import type {Request, Response} from 'express';
import {hashedPassword} from '../utils/passwords';
import {generateToken} from '../utils/jwt';
import db from '../db/connection';
import {comparePasswords} from '../utils/passwords';
import {User} from '../db/schema';


export const register = async (req: Request, res: Response) => {
 
try{
 const {email, userName, password, firstName, lastName} = req.body

const hashedPass = await hashedPassword(password)

     const user = await User.create({
      email,
      userName,
      firstName,
      lastName,
      password: hashedPass,
    });

    const token = await generateToken({
        id: user.getDataValue('id'),
        email: user.getDataValue('email'),
        username: user.getDataValue('userName')
    })

    const { password: _, ...safeUser } = user.toJSON()

    res.status(201).json({ message: 'User registered successfully', user: safeUser, token })
}
catch(error){{
    console.error('Error during registration:', error);
    res.status(500).json({  error : 'Failed to register user' });
}
}

}


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
const user = await User.findOne({
      where: { email: email }
    }) as any;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidatedPassword = await comparePasswords(password, user.password)

    if (!isValidatedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res
      .json({
        message: 'Login success',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
        token,
      })
      .status(201)
  } catch (e) {
    console.error('Loging error', e)
    res.status(500).json({ error: 'Failed to login' })
  }
}