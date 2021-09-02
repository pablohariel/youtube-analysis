import { PrismaClient } from '@prisma/client'

import { AppError } from '../../errors/AppError'

interface Request {
  id: string
}

interface Response {
  id: string,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class DeleteUserService {
  public async execute ({ id }: Request): Promise<Response> {
    const prisma = new PrismaClient()

    const checkUserExists = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!checkUserExists) {
      throw new AppError('User not found')
    }

    const deletedUser = await prisma.user.delete({
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

    return deletedUser
  }
}

export { DeleteUserService }
