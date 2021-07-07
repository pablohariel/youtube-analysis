import { GetVideoInfoService } from '../../video/GetVideoInfoService'

interface VideoData {
  channelTitle: string | null | undefined,
  videoTitle: string | null | undefined,
  publishedAt: string | null | undefined,
  viewCount: string | null | undefined,
  likeCount: string | null | undefined,
  dislikeCount: string | null | undefined,
  commentCount: string | null | undefined
}

const getVideoData = async (videoId: string): Promise<VideoData> => {
  const getVideoInfo = new GetVideoInfoService()
  const videoInfo = await getVideoInfo.execute({ videoId })

  const videoData: VideoData = {
    channelTitle: null,
    videoTitle: null,
    publishedAt: null,
    viewCount: null,
    likeCount: null,
    dislikeCount: null,
    commentCount: null
  }

  if (videoInfo) {
    const { snippet, statistics } = videoInfo
    if (snippet) {
      const { channelTitle, title, publishedAt } = snippet
      videoData.channelTitle = channelTitle
      videoData.videoTitle = title
      videoData.publishedAt = publishedAt
    }
    if (statistics) {
      const { viewCount, likeCount, dislikeCount, commentCount } = statistics
      videoData.viewCount = viewCount
      videoData.likeCount = likeCount
      videoData.dislikeCount = dislikeCount
      videoData.commentCount = commentCount
    }
  }

  return videoData
}

export { getVideoData }
