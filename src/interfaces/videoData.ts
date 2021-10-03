interface VideoData {
  id: string,
  title: string,
  description?: string,
  thumbnail: string,
  details: {
    duration: string,
    definition: string,
    caption: string
  },
  statistics: {
    viewCount: string,
    likeCount: string,
    dislikeCount: string,
    commentCount: string,
    favoriteCount: string
  },
  channelDetails: {
    id: string,
    title: string,
    thumbnail: string
  },
  defaultLanguage: string,
  published_at: string
}

export { VideoData }
