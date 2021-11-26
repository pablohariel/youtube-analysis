import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { ObjectId } from 'bson'

import { prisma } from '../database/connection'
import authConfig from '../config/auth'
import { AppError } from '../errors/AppError'

interface TokenPayload {
  iat: number;
  exp: number;
  id: string;
}

const ensureAuthenticated = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  const { secret = '' } = authConfig.jwt

  try {
    const decode = verify(token, secret)

    const { id } = decode as TokenPayload

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new AppError('Invalid JWT token', 401)
    }

    request.user = {
      id: String(id),
      isAdmin: user.isAdmin
    }

    return next()
  } catch {
    throw new AppError('Invalid JWT token', 401)
  }
}

const ensureIsAdmin = (request: Request, response: Response, next: NextFunction): void => {
  const { isAdmin } = request.user

  if (!isAdmin) {
    throw new AppError('Access denied', 401)
  }

  return next()
}

const ensureIsTheUser = (request: Request, response: Response, next: NextFunction): void => {
  const { id: userId, isAdmin } = request.user
  const { id } = request.params

  if (userId !== id && !isAdmin) {
    throw new AppError('Access denied', 401)
  }

  return next()
}

const ensureCanDeleteAnalysis = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const { id: userId, isAdmin } = request.user
  let { id: analysisId } = request.params

  try {
    analysisId = new ObjectId(analysisId).toHexString()
  } catch (error) {
    throw new AppError('Analysis not found')
  }

  const analysis = await prisma.analysis.findUnique({
    where: {
      id: analysisId
    }
  })

  if (!analysis) {
    throw new AppError('Analysis not found')
  }

  if (analysis.userId !== userId && !isAdmin) {
    throw new AppError('Access denied', 401)
  }

  return next()
}

export { ensureAuthenticated, ensureIsAdmin, ensureIsTheUser, ensureCanDeleteAnalysis }
