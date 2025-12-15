import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { env } from '../configs/env'

export const generarToken = (payload: Record<string, any>) => {
  const expiresIn: SignOptions['expiresIn'] =
    env.JWT_EXPIRES_IN ? parseInt(env.JWT_EXPIRES_IN) : '24h'

  const options: SignOptions = { expiresIn }

  return jwt.sign(
    payload,
    env.JWT_SECRET as Secret,
    options
  )
}
