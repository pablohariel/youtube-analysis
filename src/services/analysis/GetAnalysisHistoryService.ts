import { PrismaClient } from '@prisma/client'
import { AppError } from '../../errors/AppError'
import { ObjectId } from 'bson'

interface Request {
  userId: string
}

class GetAnalysisHistoryService {
  public async execute ({ userId } : Request): Promise<any> {
    const prisma = new PrismaClient()

    try {
      userId = new ObjectId(userId).toHexString()
    } catch (error) {
      throw new AppError('No analysis found')
    }

    const history = await prisma.analysis.findMany({
      where: {
        userId
      }
    })

    if (!history) {
      throw new AppError('No analysis found')
    }

    return history
  }
}

export { GetAnalysisHistoryService }
