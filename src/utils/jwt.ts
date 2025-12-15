import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { env } from '../configs/env'

export const generarToken = (payload: Record<string, any>) => {
  const expiresIn: SignOptions['expiresIn'] =
    (env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '24h'

  const options: SignOptions = { expiresIn }

  return jwt.sign(
    payload,
    env.JWT_SECRET as Secret,
    options
  )
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET as Secret)
}
