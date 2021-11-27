import { Comment } from '../../../../interfaces/comment'
import { Word } from '../../../../interfaces/word'

import { stopWords } from './utils/wordList'
import { getCommentWords } from './utils/getCommentWords'

interface Request {
  comments: Comment[],
  videoId: string,
  filters: {
    includeCommentReplies: boolean
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  words: Word[]
}

const getCommentsWords = ({ comments, videoId, filters }: Request): Response => {
  const { includeCommentReplies, avoidAccentuation, caseSensitive } = filters

  const words = [] as Word[]

  for (const comment of comments) {
    const { words: commentWords } = getCommentWords({
      comment: comment.content,
      videoId,
      filters: {
        caseSensitive,
        avoidAccentuation
      }
    })

    for (const word of commentWords) {
      if (!stopWords.includes(word)) {
        words.push({
          content: word,
          comment: comment,
          class: '',
          languages: [],
          polarity: ''
        })
      }
    }

    if (includeCommentReplies) {
      for (const reply of comment.replies) {
        const { words: replyWords } = getCommentWords({
          comment: reply.content,
          videoId,
          filters: {
            caseSensitive,
            avoidAccentuation
          }
        })

        for (const word of replyWords) {
          if (!stopWords.includes(word)) {
            const { content, author, likeCount, published_at } = reply
            const { id, name, profileImage } = author

            words.push({
              content: word,
              comment: {
                content: content,
                author: {
                  id: id,
                  name: name,
                  profileImage: profileImage
                },
                likeCount: likeCount,
                published_at: published_at
              },
              class: '',
              languages: [],
              polarity: ''
            })
          }
        }
      }
    }
  }

  return { words }
}

export { getCommentsWords }
