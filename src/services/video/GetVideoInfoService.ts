import { google } from 'googleapis'
import { youtube_v3 } from 'googleapis/build/src/apis/youtube'

import { AppError } from '../../errors/AppError'

const service = google.youtube('v3')

interface Request {
  videoId: string
}

class GetVideoInfoService {
  public async execute ({ videoId }: Request): Promise<youtube_v3.Schema$Video> {
    try {
      const response = await service.videos.list({
        key: process.env.API_KEY,
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId]
      })

      if (response.data.items !== undefined) {
        const videoInfo = response.data.items[0]

        return videoInfo
      } else {
        throw new AppError('Video not found.')
      }
    } catch (err) {
      throw new AppError('Video not found.')
    }
  }
}

export { GetVideoInfoService }
