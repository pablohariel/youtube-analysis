import { Comment } from '../../../../interfaces/comment'
import { CommentUser } from '../../../../interfaces/commentUser'

interface Request {
  comments: Comment[]
}

interface Response {
  commentsUsers: CommentUser[]
}

const getCommentsUsers = ({ comments }: Request): Response => {
  const commentsUsers = [] as CommentUser[]

  for (const comment of comments) {
    const { author } = comment
    let userFound = false
    for (const user of commentsUsers) {
      if (user.id === author.id) {
        userFound = true
        user.commentCount++
        user.comments.push(comment)
      }
    }
    if (!userFound) {
      commentsUsers.push({
        id: author.id,
        name: author.name,
        profileImage: author.profileImage,
        commentCount: 1,
        comments: [comment]
      })
    }
  }

  return { commentsUsers }
}

export { getCommentsUsers }
