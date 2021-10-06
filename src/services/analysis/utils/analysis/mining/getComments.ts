import { Comment, Reply } from '../../../../../interfaces/comment'
import { PhraseFilters } from '../../../../../interfaces/requestData'

interface Request {
  wordsToFind?: string[],
  phrasesToFind?: string[],
  comments: Comment[],
  type: 'fromWords' | 'fromPhrases',
  filters: PhraseFilters
}

interface Data {
  word?: string,
  phrase?: string,
  commentsCount: number,
  comments: (Comment | Reply)[]
}

interface Response {
  dataFound: Data[]
}

const getComments = ({ phrasesToFind, wordsToFind, comments, type, filters }: Request): Response => {
  const { includeCommentReplies } = filters

  const dataFound = [] as Data[]

  switch (type) {
    case 'fromWords': {
      if (wordsToFind) {
        for (const comment of comments) {
          for (const wordToFind of wordsToFind) {
            if (comment.content.toLowerCase().includes(wordToFind.toLowerCase())) {
              let wordAlreadyCreated = false

              for (const item of dataFound) {
                if (item.word === wordToFind.toLowerCase()) {
                  wordAlreadyCreated = true
                  item.commentsCount++
                  item.comments.push(comment)
                }
              }

              if (!wordAlreadyCreated) {
                dataFound.push({
                  word: wordToFind.toLowerCase(),
                  commentsCount: 1,
                  comments: [comment]
                })
              }
            }
            if (includeCommentReplies) {
              for (const reply of comment.replies) {
                if (reply.content.toLowerCase().includes(wordToFind.toLowerCase())) {
                  let wordAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.word === wordToFind.toLowerCase()) {
                      wordAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(reply)
                    }
                  }

                  if (!wordAlreadyCreated) {
                    dataFound.push({
                      word: wordToFind.toLowerCase(),
                      commentsCount: 1,
                      comments: [reply]
                    })
                  }
                }
              }
            }
          }
        }
      }
      break
    }
    case 'fromPhrases': {
      if (phrasesToFind) {
        for (const comment of comments) {
          for (const phraseToFind of phrasesToFind) {
            if (comment.content.toLowerCase().includes(phraseToFind.toLowerCase())) {
              let phraseAlreadyCreated = false

              for (const item of dataFound) {
                if (item.phrase === phraseToFind.toLowerCase()) {
                  phraseAlreadyCreated = true
                  item.commentsCount++
                  item.comments.push(comment)
                }
              }

              if (!phraseAlreadyCreated) {
                dataFound.push({
                  phrase: phraseToFind.toLowerCase(),
                  commentsCount: 1,
                  comments: [comment]
                })
              }
            }
            if (includeCommentReplies) {
              for (const reply of comment.replies) {
                if (reply.content.toLowerCase().includes(phraseToFind.toLowerCase())) {
                  let phraseAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.phrase === phraseToFind.toLowerCase()) {
                      phraseAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(reply)
                    }
                  }

                  if (!phraseAlreadyCreated) {
                    dataFound.push({
                      phrase: phraseToFind.toLowerCase(),
                      commentsCount: 1,
                      comments: [reply]
                    })
                  }
                }
              }
            }
          }
        }
      }
      break
    }

    default:
      break
  }

  return { dataFound }
}

export { getComments }
