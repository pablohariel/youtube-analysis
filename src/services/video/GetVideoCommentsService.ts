import { google } from 'googleapis'
import { youtube_v3 } from 'googleapis/build/src/apis/youtube'

import { AppError } from '../../errors/AppError'
import { Comment } from '../../interfaces/comment'

const service = google.youtube('v3')

interface Request {
  videoId: string
}

interface Response {
  comments: Comment[]
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
            part: ['id', 'snippet', 'replies'],
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
            part: ['id', 'snippet', 'replies'],
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
          const { textDisplay, likeCount, viewerRating, authorDisplayName, authorProfileImageUrl, authorChannelId, publishedAt } = commentData
          const { totalReplyCount } = snippet
          const { replies } = item

          const filteredReplies = replies?.comments || []
          const finalReplies = filteredReplies.map(reply => {
            return {
              content: reply.snippet?.textDisplay || '',
              author: {
                id: reply.snippet?.authorChannelId || '',
                name: reply.snippet?.authorDisplayName || '',
                profileImage: reply.snippet?.authorProfileImageUrl || ''
              },
              likeCount: reply.snippet?.likeCount || 0,
              published_at: reply.snippet?.publishedAt || ''
            }
          })

          const comment = {
            content: textDisplay || '',
            author: {
              id: authorChannelId?.value || '',
              name: authorDisplayName || '',
              profileImage: authorProfileImageUrl || ''
            },
            likeCount: likeCount || 0,
            replyCount: totalReplyCount || 0,
            replies: finalReplies || [],
            published_at: publishedAt || ''
          } as Comment

          comments.push(comment)
        }
      }
    }

    return { comments }
  }
}

export { GetVideoCommentsService }
