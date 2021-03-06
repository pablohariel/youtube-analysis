import { Language } from 'node-nlp'
import { Language as LanguageType } from '../../../../../interfaces/languages'

interface Request {
  text: string
}

interface Response {
  language: LanguageType
}

const guessLanguage = ({ text }: Request): Response => {
  const language = new Language()

  try {
    const guess = language.guess(text, ['pt', 'en', 'es', 'ru', 'fr'])

    let languageFound = 'not found' as LanguageType

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
    return { language: 'not found' }
  }
}

export { guessLanguage }
