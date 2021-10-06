import { Comment, Reply } from './comment'

interface UserFromData {
  user: {
    id: string,
    name: string,
    profileImage: string
  },
  commentsCount: number,
  comments: (Comment | Reply)[]
}

export { UserFromData }
