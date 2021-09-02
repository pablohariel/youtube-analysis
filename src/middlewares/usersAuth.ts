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

const ensureAuthenticated = (request: Request, response: Response, next: NextFunction): void => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  const { secret = '' } = authConfig.jwt

  try {
    const decode = verify(token, secret)

    const { id } = decode as TokenPayload

    request.user = {
      id: String(id)
    }

    return next()
  } catch {
    throw new AppError('Invalid JWT token', 401)
  }
}

const secureUserPermission = (request: Request, response: Response, next: NextFunction): void => {
  const { id } = request.params

  if (request.user.id !== id) {
    throw new AppError('Access denied', 401)
  }

  return next()
}

const secureUserPermissionToDelete = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
  const { user } = request
  let { id } = request.params

  try {
    id = new ObjectId(id).toHexString()
  } catch (error) {
    throw new AppError('Analysis not found')
  }

  const analysis = await prisma.analysis.findUnique({
    where: {
      id
    }
  })

  if (!analysis) {
    throw new AppError('Analysis not found')
  }

  if (analysis?.userId !== user.id) {
    throw new AppError('Access denied', 401)
  }

  return next()
}

export { ensureAuthenticated, secureUserPermission, secureUserPermissionToDelete }
