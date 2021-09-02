import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import authConfig from '../../config/auth'
import { AppError } from '../../errors/AppError'

interface Request {
  email: string,
  password: string
}

interface Response {
  user: {
    id: string,
    email: string,
    name: string | null,
    created_at: Date,
    updated_at: Date
  },
  token: string
}

class AuthenticateUserService {
  public async execute ({ email, password }: Request): Promise<Response> {
    const prisma = new PrismaClient()

    if (!email || !password) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    if (email.length < 3) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    if (password.length < 8) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const { secret = '', expiresIn } = authConfig.jwt

    const token = sign({ id: user.id }, secret, { expiresIn: expiresIn })

    const filteredUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return {
      user: filteredUser,
      token
    }
  }
}

export { AuthenticateUserService }
