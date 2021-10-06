import { classes } from './wordList'

interface Response {
  result: 'adjective' | 'noun' | 'verb' | 'undefined'
}

const getWordClass = (word: string, language: 'pt-br'): Response => {
  if (language === 'pt-br') {
    const { adjectives, nouns, verbs } = classes.ptBr

    if (adjectives.includes(word)) {
      return { result: 'adjective' }
    }

    if (nouns.includes(word)) {
      return { result: 'noun' }
    }

    if (verbs.includes(word)) {
      return { result: 'verb' }
    }
  }

  return { result: 'undefined' }
}

export { getWordClass }
