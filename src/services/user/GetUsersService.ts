import { PrismaClient } from '@prisma/client'

interface Response {
  id: number,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class GetUsersService {
  public async execute (): Promise<Response[]> {
    const prisma = new PrismaClient()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })

    return users
  }
}

export { GetUsersService }
