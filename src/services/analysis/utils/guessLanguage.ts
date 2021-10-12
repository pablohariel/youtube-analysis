import { Language } from 'node-nlp'
import { Language } from '../../../interfaces/languages'

interface Request {
  text: string
}

interface Response {
  language: Language
}

const guessLanguage = ({ text }: Request): Response => {
  const language = new Language()

  try {
    const guess = language.guess(text, ['pt', 'en', 'es', 'ru', 'fr'])

    let languageFound = 'not found' as Language

    if (guess) {
      if (guess[0]) {
        switch (guess[0].alpha2) {
          case 'pt':
            languageFound = 'pt'
            break
          case 'en':
            languageFound = 'en'
            break
          case 'es':
            languageFound = 'es'
            break
          case 'ru':
            languageFound = 'ru'
            break
          case 'fr':
            languageFound = 'fr'
            break
          default:
            languageFound = 'not found'
        }
      }
    }

    return { language: languageFound }
  } catch (err) {
    console.log('erro aqui')
    return { language: 'not found' }
  }
}

export { guessLanguage }
