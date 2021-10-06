import { WordDetails } from '../types'
import { getMainPolarity } from './getMainPolarity'

interface Request {
  words: WordDetails[],
  mood: string
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getGeneratedMessages = ({ words, mood }: Request): string[] => {
  const messages: string[] = []

  const firstNoun = words.filter(word => {
    if (word.class === 'noun') {
      return true
    }
    return false
  })[0]

  const { polarity: mainPolarity } = getMainPolarity({ words })

  messages.push(`People are commenting a lot about ${capitalizeFirstLetter(firstNoun.word)}`)
  messages.push(`The general mood is ${mood}`)
  messages.push(`The words majority are of ${mainPolarity} polarity`)

  return messages
}

export { getGeneratedMessages }
