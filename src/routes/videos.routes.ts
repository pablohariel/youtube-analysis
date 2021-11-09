import { Router } from 'express'

import { GetVideoDataService } from '../services/video/GetVideoDataService'

const videosRouter = Router()

videosRouter.get('/', async (request, response) => {
  const { videoId } = request.query as { videoId: string }
  const service = new GetVideoDataService()
  const { videoData } = await service.execute({ videoId })
  return response.json(videoData)
})

export { videosRouter }
