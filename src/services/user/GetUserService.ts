import { PrismaClient } from '@prisma/client'

import { AppError } from '../../errors/AppError'

interface Request {
  id: number
}

interface Response {
  id: number,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class GetUserService {
  public async execute ({ id }: Request): Promise<Response> {
    const prisma = new PrismaClient()

    if (/^\d+$/.test(String(id)) === false) {
      throw new AppError('User not found')
    }

    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })

    if (!user) {
      throw new AppError('User not found')
    }

    return user
  }
}

export { GetUserService }
