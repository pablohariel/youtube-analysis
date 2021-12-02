import { Comment, Reply } from '../../../../interfaces/comment'

interface Request {
  wordsToFind?: string[],
  phrasesToFind?: string[],
  comments: Comment[],
  type: 'fromWords' | 'fromPhrases',
  filters: {
    includeCommentReplies: boolean
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
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
  const { includeCommentReplies, avoidAccentuation, caseSensitive } = filters

  const dataFound = [] as Data[]

  switch (type) {
    case 'fromWords': {
      if (wordsToFind) {
        if(caseSensitive) {
          if(avoidAccentuation) {
            for (const comment of comments) {
              for (let wordToFind of wordsToFind) {
                wordToFind = wordToFind.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '')
                if (comment.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(wordToFind)) {
                  let wordAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.word === wordToFind) {
                      wordAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(comment)
                    }
                  }

                  if (!wordAlreadyCreated) {
                    dataFound.push({
                      word: wordToFind,
                      commentsCount: 1,
                      comments: [comment]
                    })
                  }
                }
                if (includeCommentReplies) {
                  for (const reply of comment.replies) {
                    if (reply.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(wordToFind)) {
                      let wordAlreadyCreated = false

                      for (const item of dataFound) {
                        if (item.word === wordToFind) {
                          wordAlreadyCreated = true
                          item.commentsCount++
                          item.comments.push(reply)
                        }
                      }

                      if (!wordAlreadyCreated) {
                        dataFound.push({
                          word: wordToFind,
                          commentsCount: 1,
                          comments: [reply]
                        })
                      }
                    }
                  }
                }
              }
            }
          } else {
            for (const comment of comments) {
              for (let wordToFind of wordsToFind) {
                wordToFind = wordToFind.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '')
                if (comment.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(wordToFind)) {
                  let wordAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.word === wordToFind) {
                      wordAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(comment)
                    }
                  }

                  if (!wordAlreadyCreated) {
                    dataFound.push({
                      word: wordToFind,
                      commentsCount: 1,
                      comments: [comment]
                    })
                  }
                }
                if (includeCommentReplies) {
                  for (const reply of comment.replies) {
                    if (reply.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(wordToFind)) {
                      let wordAlreadyCreated = false

                      for (const item of dataFound) {
                        if (item.word === wordToFind) {
                          wordAlreadyCreated = true
                          item.commentsCount++
                          item.comments.push(reply)
                        }
                      }

                      if (!wordAlreadyCreated) {
                        dataFound.push({
                          word: wordToFind,
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
        } else {
          if(avoidAccentuation) {
            for (const comment of comments) {
              for (let wordToFind of wordsToFind) {
                wordToFind = wordToFind.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').toLowerCase()
                if (comment.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').toLowerCase().includes(wordToFind)) {
                  let wordAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.word === wordToFind) {
                      wordAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(comment)
                    }
                  }

                  if (!wordAlreadyCreated) {
                    dataFound.push({
                      word: wordToFind,
                      commentsCount: 1,
                      comments: [comment]
                    })
                  }
                }
                if (includeCommentReplies) {
                  for (const reply of comment.replies) {
                    if (reply.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').toLowerCase().includes(wordToFind)) {
                      let wordAlreadyCreated = false

                      for (const item of dataFound) {
                        if (item.word === wordToFind) {
                          wordAlreadyCreated = true
                          item.commentsCount++
                          item.comments.push(reply)
                        }
                      }

                      if (!wordAlreadyCreated) {
                        dataFound.push({
                          word: wordToFind,
                          commentsCount: 1,
                          comments: [reply]
                        })
                      }
                    }
                  }
                }
              }
            }
          } else {
            for (const comment of comments) {
              for (let wordToFind of wordsToFind) {
                wordToFind = wordToFind.toLowerCase()
                if (comment.content.toLowerCase().includes(wordToFind)) {
                  let wordAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.word === wordToFind) {
                      wordAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(comment)
                    }
                  }

                  if (!wordAlreadyCreated) {
                    dataFound.push({
                      word: wordToFind,
                      commentsCount: 1,
                      comments: [comment]
                    })
                  }
                }
                if (includeCommentReplies) {
                  for (const reply of comment.replies) {
                    if (reply.content.toLowerCase().includes(wordToFind)) {
                      let wordAlreadyCreated = false

                      for (const item of dataFound) {
                        if (item.word === wordToFind) {
                          wordAlreadyCreated = true
                          item.commentsCount++
                          item.comments.push(reply)
                        }
                      }

                      if (!wordAlreadyCreated) {
                        dataFound.push({
                          word: wordToFind,
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
        }
      }
      break
    }
    case 'fromPhrases': {
      if (phrasesToFind) {
        for (let comment of comments) {
          comment.content = avoidAccentuation ? comment.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : comment.content
          comment.content = caseSensitive ? comment.content : comment.content.toLocaleLowerCase()

          for (let phraseToFind of phrasesToFind) {
            phraseToFind = avoidAccentuation ? phraseToFind.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : phraseToFind
            phraseToFind = caseSensitive ? phraseToFind : phraseToFind.toLocaleLowerCase()

            if (comment.content.includes(phraseToFind)) {
              let phraseAlreadyCreated = false

              for (const item of dataFound) {
                if (item.phrase === phraseToFind) {
                  phraseAlreadyCreated = true
                  item.commentsCount++
                  item.comments.push(comment)
                }
              }

              if (!phraseAlreadyCreated) {
                dataFound.push({
                  phrase: phraseToFind,
                  commentsCount: 1,
                  comments: [comment]
                })
              }
            }
            if (includeCommentReplies) {
              for (let reply of comment.replies) {
                reply.content = avoidAccentuation ? reply.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : reply.content
                reply.content = caseSensitive ? reply.content : reply.content.toLocaleLowerCase()

                if (reply.content.includes(phraseToFind)) {
                  let phraseAlreadyCreated = false

                  for (const item of dataFound) {
                    if (item.phrase === phraseToFind) {
                      phraseAlreadyCreated = true
                      item.commentsCount++
                      item.comments.push(reply)
                    }
                  }

                  if (!phraseAlreadyCreated) {
                    dataFound.push({
                      phrase: phraseToFind,
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
