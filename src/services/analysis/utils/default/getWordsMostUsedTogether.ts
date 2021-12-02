import { Word } from '../../../../interfaces/word'
import { WordsTogether } from '../../../../interfaces/wordsTogether'
import { stopWords } from '../words/utils/wordList'

interface Request {
  words: Word[]
  videoId: string
  filters: {
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  wordsMostUsedTogether: WordsTogether[]
}

const getWordsMostUsedTogether = ({ words, videoId, filters }: Request): Response => {
  const { avoidAccentuation, caseSensitive } = filters

  const wordsMostUsedTogether = [] as WordsTogether[]

  for (const word of words) {
    const commentWords = word.comment.content.match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9-]+/g)?.map(commentWord => {
      if (caseSensitive) {
        return avoidAccentuation ? commentWord.normalize('NFD').replace(/[^A-Za-z0-9-]/g, '') : commentWord
      } else {
        return avoidAccentuation ? commentWord.toLowerCase().normalize('NFD').replace(/[^a-z0-9-]/g, '') : commentWord.toLowerCase()
      }
    }).filter(commentWord => commentWord !== word.content)

    if (commentWords) {
      for (const commentWord of commentWords) {
        if (!stopWords.includes(commentWord) && !commentWord.includes(videoId.toLocaleLowerCase()) && commentWord.length > 1) {
          const wordsAlreadyFound = wordsMostUsedTogether.filter(wordsTogether => wordsTogether.words.includes(word.content) && wordsTogether.words.includes(commentWord))
          if (wordsAlreadyFound.length > 0) {
            if (wordsAlreadyFound[0].comments.filter(comment => comment.content === word.comment.content).length < 1) {
              wordsAlreadyFound[0].timesUsed++
              wordsAlreadyFound[0].comments.push(word.comment)
            }
          } else {
            wordsMostUsedTogether.push({
              timesUsed: 1,
              words: [word.content, commentWord],
              comments: [word.comment]
            })
          }
        }
      }
    }
  }

  const wordsMostUsedTogetherSorted = wordsMostUsedTogether.sort((wL, wR) => {
    if (wL.timesUsed > wR.timesUsed) {
      return -1
    }
    if (wR.timesUsed > wL.timesUsed) {
      return 1
    }

    return 0
  })

  return { wordsMostUsedTogether: wordsMostUsedTogetherSorted.slice(0, 10) }
}

export { getWordsMostUsedTogether }
