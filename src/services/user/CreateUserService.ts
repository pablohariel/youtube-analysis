import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { AppError } from '../../errors/AppError'

interface Request {
  email: string,
  name?: string,
  password: string
}

interface Response {
  id: string,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class CreateUserService {
  public async execute ({ email = '', password = '', name }: Request): Promise<Response> {
    const prisma = new PrismaClient()

    if (email.length < 1 || password.length < 1) {
      throw new AppError('Required field not informed')
    }

    if (email.length < 3) {
      throw new AppError('Invalid email', 422)
    }

    if (name) {
      if (name.length < 3) {
        throw new AppError('Name too short', 422)
      }
    }

    if (password.length < 8) {
      throw new AppError('Password too short', 422)
    }

    const checkUserExists = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used', 409)
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })

    return user
  }
}

export { CreateUserService }
