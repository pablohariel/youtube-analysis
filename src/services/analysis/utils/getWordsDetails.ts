
import { getWordPolarity } from './getWordPolarity'
import { getWordClass } from './getWordClass'

interface WordDetails {
  word: string,
  timesUsed: number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
  brothers: string[]
}

interface Brother {
  word: string,
  timesUsed: number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined'
}

interface Response {
  word: string,
  timesUsed: number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
  brothers: Brother[]
}

interface Word {
  word: string,
  brothers: string[]
}

const getWordsDetails = (words: Word[], language: 'pt-br'): Response[] => {
  const wordsDetails: WordDetails[] = []

  for (const item of words) {
    const { word, brothers } = item
    let wordFound = false
    for (const wordDetails of wordsDetails) {
      if (word === wordDetails.word) {
        wordFound = true
        wordDetails.timesUsed++
        wordDetails.brothers = [...wordDetails.brothers, ...brothers]
      }
    }
    if (!wordFound) {
      if (word.length > 2) {
        const { result: polarityResult } = getWordPolarity(word, language)
        const { result: classResult } = getWordClass(word, language)

        wordsDetails.push({
          word,
          timesUsed: 1,
          polarity: polarityResult,
          class: classResult,
          brothers: brothers
        })
      }
    }
  }

  let wordDetailsFiltered: Response[] = []

  for (const item of wordsDetails) {
    const { brothers } = item
    let filteredBrothers: Brother[] = []
    let wordFound = false
    for (const word of brothers) {
      for (const brother of filteredBrothers) {
        if (brother.word === word) {
          wordFound = true
          brother.timesUsed++
        }
      }
      if (!wordFound) {
        const { result: polarityResult } = getWordPolarity(word, language)
        const { result: classResult } = getWordClass(word, language)

        filteredBrothers.push({ word, timesUsed: 1, polarity: polarityResult, class: classResult })
      }
    }

    filteredBrothers = filteredBrothers.sort((a, b) => {
      if (a.timesUsed > b.timesUsed) {
        return -1
      }
      if (b.timesUsed < a.timesUsed) {
        return 1
      }

      return 0
    })

    wordDetailsFiltered.push({ word: item.word, timesUsed: item.timesUsed, polarity: item.polarity, class: item.class, brothers: filteredBrothers })
  }

  wordDetailsFiltered = wordDetailsFiltered.sort((a, b) => {
    if (a.timesUsed > b.timesUsed) {
      return -1
    }
    if (b.timesUsed > a.timesUsed) {
      return 1
    }

    return 0
  })

  return wordDetailsFiltered
}

export { getWordsDetails }
