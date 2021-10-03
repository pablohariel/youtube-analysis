interface Comment {
  content: string,
  author: {
    id: string,
    name: string,
    profileImage: string
  },
  likeCount: number,
  replyCount: number,
  replies: {
    content: string,
    author: {
      id: string,
      name: string,
      profileImage: string
    },
    likeCount: number,
    published_at: string
  }[],
  published_at: string
}

export { Comment }
