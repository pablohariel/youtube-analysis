import { filterWords, filterWordsAndBrothers } from './filters'

interface WordAndBrothers {
  word: string,
  wordBrothers: string[]
}

interface Response {
  wordsAndBrothers: WordAndBrothers[],
  words: string[]
}

const getWordsFromComments = (comments: (string | null | undefined)[]): Response => {
  let wordsAndBrothers: WordAndBrothers[] = []
  let words: string[] = []

  for (const comment of comments) {
    if (comment) {
      for (const primaryWord of comment?.split(' ')) {
        if (primaryWord.length > 2) {
          const result: WordAndBrothers = {
            word: primaryWord.toLowerCase(),
            wordBrothers: []
          }

          for (const secondaryWord of comment?.split(' ')) {
            if (secondaryWord.length > 2 && secondaryWord !== primaryWord) {
              result.wordBrothers.push(secondaryWord.toLowerCase())
            }
          }
          wordsAndBrothers.push(result)
          words.push(primaryWord)
        }
      }
    }
  }

  wordsAndBrothers = filterWordsAndBrothers(wordsAndBrothers)

  words = filterWords(words)

  return { wordsAndBrothers, words }
}

export { getWordsFromComments }
