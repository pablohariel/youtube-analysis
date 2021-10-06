import { Router } from 'express'

import { CreateUserService } from '../services/user/CreateUserService'
import { UpdateUserService } from '../services/user/UpdateUserService'
import { GetUserService } from '../services/user/GetUserService'
import { ListUserService } from '../services/user/ListUserService'
import { DeleteUserService } from '../services/user/DeleteUserService'

// test
import { GetVideoCommentsService } from '../services/video/GetVideoCommentsService'
import { getCommentCount } from '../services/analysis/utils/comment/getCommentCount'
import { getComment } from '../services/analysis/utils/comment/getComment'
import { getUsers } from '../services/analysis/utils/comment/getUsers'
import { getUserWithMostComment } from '../services/analysis/utils/comment/getUserWithMostComment'
import { getWords } from '../services/analysis/utils/word/getWords'
import { getJoinedWords } from '../services/analysis/utils/word/getJoinedWords'
import { getMostUsedWords } from '../services/analysis/utils/word/getMostUsedWords'
import { getWordCount } from '../services/analysis/utils/word/getWordCount'
import { sortJoinedWords } from '../services/analysis/utils/word/utils/sortJoinedWords'
import { getWordsMostUsedTogether } from '../services/analysis/utils/word/getWordsMostUsedTogether'
import { getWordsRelatedToVideoTitle } from '../services/analysis/utils/word/getWordsRelatedToVideoTitle'
import { getRequestedWords } from '../services/analysis/utils/word/getRequestedWords'
import { getPhrases } from '../services/analysis/utils/getPhrases'
import { getRequestedComments } from '../services/analysis/utils/comment/getRequestedComments'
//

import { ensureAuthenticated, ensureIsTheUser, ensureIsAdmin } from '../middlewares/usersAuth'

const usersRouter = Router()

usersRouter.get('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params

  const getUser = new GetUserService()

  const user = await getUser.execute({
    id
  })

  return response.json(user)
})

usersRouter.get('/', ensureAuthenticated, ensureIsAdmin, async (request, response) => {
  const listUsers = new ListUserService()

  const users = await listUsers.execute()

  return response.json(users)
})

usersRouter.post('/', async (request, response) => {
  // test
  const getComments = new GetVideoCommentsService()
  const { comments } = await getComments.execute({ videoId: 'Xedqo18PLds' })
  const { users } = getUsers({ comments })
  const userWithMostComment = getUserWithMostComment({ users })
  const { words } = getWords({ comments, videoId: 'Xedqo18PLds', includeReplies: true })
  const { joinedWords } = getJoinedWords({ words, videoId: 'Xedqo18PLds' })
  const { mostUsedWords } = getMostUsedWords({ words: joinedWords })
  const { wordCount } = getWordCount({ words })
  const { sortedJoinedWords } = sortJoinedWords({ words: joinedWords, sortBrothers: true })
  const { wordsMostUsedTogether } = getWordsMostUsedTogether({ words: sortedJoinedWords })
  const { words: wordsMined } = getRequestedWords({ wordsToFind: ['inter', 'internacional', 'pedro'], words: joinedWords })
  const { phrases: phrasesMined } = getPhrases({ phrasesToFind: ['inter foi melhor', ' ', 'galo campeão'], comments, includeReplies: true })
  const { dataFound } = getRequestedComments({ comments: comments, phrasesToFind: ['galo campeão', 'bunda'], type: 'fromPhrases', includeReplies: true })

  const videoTitle = 'ATLÉTICO-MG 1 x 0 INTERNACIONAL | MELHORES MOMENTOS | 23ª RODADA BRASILEIRÃO 2021 | ge.globo'
  const { wordsRelatedToVideoTitle } = getWordsRelatedToVideoTitle({ videoTitle: videoTitle.toLocaleLowerCase(), words: joinedWords })

  // const { joinedWords } = getJoinedWords({
  //   words:
  // [
  //   {
  //     content: 'ice',
  //     languages: [],
  //     polarity: '',
  //     class: '',
  //     comment: {
  //       content: 'Plz eat green tea ice cream cake and make any green tea party',
  //       author: {
  //         id: 'string',
  //         name: 'string',
  //         profileImage: 'string'
  //       },
  //       likeCount: 0,
  //       replyCount: 0,
  //       replies: [],
  //       published_at: 'string'
  //     }
  //   },
  //   {
  //     content: 'ice',
  //     languages: [],
  //     polarity: '',
  //     class: '',
  //     comment: {
  //       content: 'angun tidur langsung lihat ice cream sebesar itu',
  //       author: {
  //         id: 'string',
  //         name: 'string',
  //         profileImage: 'string'
  //       },
  //       likeCount: 0,
  //       replyCount: 0,
  //       replies: [],
  //       published_at: 'string'
  //     }
  //   },
  //   {
  //     content: 'cream',
  //     languages: [],
  //     polarity: '',
  //     class: '',
  //     comment: {
  //       content: 'Plz eat green tea ice cream cake and make any green tea party',
  //       author: {
  //         id: 'string',
  //         name: 'string',
  //         profileImage: 'string'
  //       },
  //       likeCount: 0,
  //       replyCount: 0,
  //       replies: [],
  //       published_at: 'string'
  //     }
  //   }
  // ]
  // })

  const { commentCount } = getCommentCount({ comments, includeReplies: true })

  return response.json({ dataFound })
  //

  const { email, password, name } = request.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({ email, password, name })

  return response.status(201).json(user)
})

usersRouter.put('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  const updateUser = new UpdateUserService()

  const updatedUser = await updateUser.execute({ id, name })

  return response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params

  const deleteUser = new DeleteUserService()

  const deletedUser = await deleteUser.execute({
    id
  })

  return response.json(deletedUser)
})

export { usersRouter }
