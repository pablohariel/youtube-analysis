import { stopWords } from './word/wordList'

interface Word {
  word: string,
  brothers: string[]
}

const filterWords = (words: Word[]): Word[] => {
  const filteredWords: Word[] = []

  for (let { word, brothers } of words) {
    word = filterNonStopWords([word])[0]

    if (word && word.length > 2) {
      let filteredBrothers: string[] = []

      if (brothers.length > 1) {
        filteredBrothers = filterNonStopWords(brothers)
      }

      filteredWords.push({
        word,
        brothers: filteredBrothers
      })
    }
  }

  return filteredWords
}

const filterNonStopWords = (words: string[]): string[] => {
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

export { filterWords }
