import { stopWords } from './wordList'

interface WordAndBrothers {
  word: string,
  wordBrothers: string[]
}

const filterWordsAndBrothers = (words: WordAndBrothers[]): WordAndBrothers[] => {
  const filteredWordsAndBrothers: WordAndBrothers[] = []

  for (const { word, wordBrothers } of words) {
    if (word.length > 2) {
      let filteredWordBrothers: string[] = []

      if (wordBrothers.length > 1) {
        filteredWordBrothers = filterWords(wordBrothers)
      }

      filteredWordsAndBrothers.push({
        word,
        wordBrothers: filteredWordBrothers
      })
    }
  }

  return filteredWordsAndBrothers
}

const filterWords = (words: string[]): string[] => {
  const common = stopWords

  const sentence = words.join(' ')
  const wordArr: any = sentence.match(/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+/g)
  const commonObj: any = {}
  const uncommonArr = []
  let word
  let i

  for (i = 0; i < common.length; i++) {
    commonObj[common[i].trim()] = true
  }

  if (wordArr) {
    for (i = 0; i < wordArr.length; i++) {
      word = wordArr[i].trim().toLowerCase()
      if (!commonObj[word]) {
        if (word.length > 2) {
          uncommonArr.push(word)
        }
      }
    }
  }

  return uncommonArr
}

export { filterWords, filterWordsAndBrothers }
