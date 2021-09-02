import { prisma } from '../../database/connection'
import { AppError } from '../../errors/AppError'

interface Request {
  id: string,
  name: string,
}

interface Response {
  id: string,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class UpdateUserService {
  public async execute ({ id, name }: Request): Promise<Response> {
    const checkUserExists = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!checkUserExists) {
      throw new AppError('User not found')
    }

    if (name) {
      if (name.length < 3) {
        throw new AppError('Name too short', 422)
      }
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        name
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

export { UpdateUserService }
