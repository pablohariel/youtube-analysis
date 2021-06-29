import { google } from 'googleapis'
import { youtube_v3 } from 'googleapis/build/src/apis/youtube'

import { AppError } from '../../errors/AppError'

const service = google.youtube('v3')

interface Request {
  videoId: string
}

class GetVideoCommentsService {
  public async execute ({ videoId } : Request): Promise<Array<string | null | undefined>> {
    let pageToken: string | null | undefined = null
    let comments: youtube_v3.Schema$CommentThread[] | undefined = []

    try {
      do {
        if (!pageToken) {
          const response = await service.commentThreads.list({
            key: process.env.API_KEY,
            part: ['id', 'snippet'],
            videoId: videoId,
            maxResults: 100
          })

          pageToken = response.data.nextPageToken

          if (response.data.items !== undefined) {
            comments = [...comments, ...response.data.items]
          }
        } else {
          const response = await service.commentThreads.list({
            key: process.env.API_KEY,
            part: ['snippet'],
            videoId: videoId,
            pageToken: pageToken,
            maxResults: 100
          })

          pageToken = response.data.nextPageToken

          if (response.data.items !== undefined) {
            comments = [...comments, ...response.data.items]
          }
        }
      } while (pageToken)
    } catch (err) {
      throw new AppError('Video not found.')
    }

    const filteredComments = comments.map(comment => {
      return comment.snippet?.topLevelComment?.snippet?.textDisplay
    })

    return filteredComments
  }
}

export { GetVideoCommentsService }
