import { google } from 'googleapis'

import { AppError } from '../../errors/AppError'
import { VideoData } from '../../interfaces/videoData'

const service = google.youtube('v3')

interface Request {
  videoId: string
}

interface Response {
  videoData: VideoData
}

class GetVideoDataService {
  public async execute ({ videoId }: Request): Promise<Response> {
    try {
      const videoReponse = await service.videos.list({
        key: process.env.API_KEY,
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId]
      })

      console.log(videoReponse.data.pageInfo)

      if (videoReponse.data.items !== undefined) {
        const video = videoReponse.data.items[0]
        const { snippet, statistics, contentDetails } = video
        const videoData = {} as VideoData

        if (snippet && contentDetails && statistics) {
          const { title, publishedAt, channelId, description, defaultLanguage, thumbnails, channelTitle } = snippet
          const { caption, duration, definition } = contentDetails
          const { viewCount, likeCount, dislikeCount, commentCount, favoriteCount } = statistics

          videoData.title = title || ''
          videoData.description = description || undefined
          videoData.thumbnail = thumbnails?.high?.url || ''

          videoData.details = {
            caption: '',
            definition: '',
            duration: ''
          }
          videoData.details.duration = duration || ''
          videoData.details.definition = definition || ''
          videoData.details.caption = caption || ''

          videoData.statistics = {
            commentCount: '',
            dislikeCount: '',
            favoriteCount: '',
            likeCount: '',
            viewCount: ''
          }
          videoData.statistics.viewCount = viewCount || ''
          videoData.statistics.likeCount = likeCount || ''
          videoData.statistics.dislikeCount = dislikeCount || ''
          videoData.statistics.commentCount = commentCount || ''
          videoData.statistics.favoriteCount = favoriteCount || ''

          videoData.channelDetails = {
            id: '',
            thumbnail: '',
            title: ''
          }

          const channelIdChecked = channelId || ''

          const channelResponse = await service.channels.list({
            key: process.env.API_KEY,
            part: ['snippet'],
            id: [channelIdChecked]
          })

          if (channelResponse.data.items) {
            const { snippet: channelSnippet } = channelResponse.data.items[0]

            if (channelSnippet) {
              const { thumbnails: channelThumbnails } = channelSnippet
              videoData.channelDetails.thumbnail = channelThumbnails?.high?.url || ''
            }
          }

          videoData.channelDetails.id = channelId || ''
          videoData.channelDetails.title = channelTitle || ''

          videoData.defaultLanguage = defaultLanguage || ''
          videoData.published_at = publishedAt || ''
        }

        return { videoData }
      } else {
        throw new AppError('Video not found.')
      }
    } catch (err) {
      console.error(err)
      throw new AppError('Video not found.')
    }
  }
}

export { GetVideoDataService }
