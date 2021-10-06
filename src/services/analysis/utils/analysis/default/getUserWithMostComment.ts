import { CommentUser } from '../../../../../interfaces/commentUser'

interface Request {
  users: CommentUser[]
}

interface Response {
  userWithMostComment: CommentUser
}

const getUserWithMostComment = ({ users }: Request): Response => {
  const usersWithMostComment = users.sort((userL, userR) => {
    if (userL.commentCount > userR.commentCount) {
      return -1
    }
    if (userL.commentCount < userR.commentCount) {
      return 1
    }
    return 0
  })

  const userWithMostComment = usersWithMostComment[0]

  return { userWithMostComment }
}

export { getUserWithMostComment }
