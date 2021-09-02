
import { prisma } from '../../database/connection'
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
    const checkUserExists = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!checkUserExists) {
      throw new AppError('User not found')
    }

    await prisma.analysis.deleteMany({
      where: {
        userId: id
      }
    })

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
