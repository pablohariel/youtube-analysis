import { google } from 'googleapis'
import { youtube_v3 } from 'googleapis/build/src/apis/youtube'

import { AppError } from '../../errors/AppError'
import { Comment } from '../analysis/types/index'

const service = google.youtube('v3')

interface Request {
  videoId: string
}

interface Response {
  comments: Array<Comment>
}

class GetVideoCommentsService {
  public async execute ({ videoId } : Request): Promise<Response> {
    let pageToken: string | null | undefined = null
    let apiComments: youtube_v3.Schema$CommentThread[] | undefined = []

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
            apiComments = [...apiComments, ...response.data.items]
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
            apiComments = [...apiComments, ...response.data.items]
          }
        }
      } while (pageToken)
    } catch (err) {
      throw new AppError('Video not found.')
    }

    const comments = [] as Array<Comment>

    for (const item of apiComments) {
      if (item) {
        const commentData = item.snippet?.topLevelComment?.snippet
        const snippet = item.snippet

        if (commentData && snippet) {
          const { textDisplay, likeCount, authorDisplayName, authorProfileImageUrl, publishedAt } = commentData
          const { totalReplyCount } = snippet
          const { replies } = item

          const comment = {
            content: textDisplay || '',
            author: {
              name: authorDisplayName || '',
              profileImage: authorProfileImageUrl || ''
            },
            likeCount: likeCount || 0,
            replyCount: totalReplyCount || 0,
            replies: replies || [],
            published_at: publishedAt || ''
          } as Comment

          comments.push(comment)
        }
      }
    }

    console.log(comments[0])

    return { comments }
  }
}

export { GetVideoCommentsService }
