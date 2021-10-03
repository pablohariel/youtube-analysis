import { Comment } from '../../../../interfaces/comment'
import { CommentUser } from '../../../../interfaces/commentUser'

interface Request {
  comments: Comment[]
}

interface Response {
  users: CommentUser[]
}

const getUsers = ({ comments }: Request): Response => {
  const users = [] as CommentUser[]

  for (const comment of comments) {
    const { author } = comment
    let userFound = false
    for (const user of users) {
      if (user.id === author.id) {
        userFound = true
        user.commentCount++
        user.comments.push(comment)
      }
    }
    if (!userFound) {
      users.push({
        id: author.id,
        name: author.name,
        profileImage: author.profileImage,
        commentCount: 1,
        comments: [comment]
      })
    }
  }

  return { users }
}

export { getUsers }
