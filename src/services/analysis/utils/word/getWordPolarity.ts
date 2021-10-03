import { polarity } from './wordList'

interface Response {
  result: 'positive' | 'negative' | 'neutral'
}

const getWordPolarity = (word: string, language: 'pt-br'): Response => {
  if (language === 'pt-br') {
    const { positive, negative } = polarity.ptBr

    if (positive.includes(word)) {
      return { result: 'positive' }
    }

    if (negative.includes(word)) {
      return { result: 'negative' }
    }
  }

  return { result: 'neutral' }
}

export { getWordPolarity }
