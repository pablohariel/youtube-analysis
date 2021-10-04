import { CommentUser } from '../../../../interfaces/commentUser'

interface Request {
  users: CommentUser[]
}

interface Response {
  user: CommentUser
}

const getUserWithMostComment = ({ users }: Request): Response => {
  const topUsers = users.sort((userL, userR) => {
    if (userL.commentCount > userR.commentCount) {
      return -1
    }
    if (userL.commentCount < userR.commentCount) {
      return 1
    }
    return 0
  })

  const topUser = topUsers[0]

  return { user: topUser }
}

export { getUserWithMostComment }
