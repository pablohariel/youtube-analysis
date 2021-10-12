interface LanguagesCount {
  pt: {
    language: 'pt',
    count: number
  },
  en: {
    language: 'en',
    count: number
  },
  es: {
    language: 'es',
    count: number
  },
  ru: {
    language: 'ru',
    count: number
  },
  fr: {
    language: 'fr',
    count: number
  },
  notFound: {
    language: 'not found',
    count: number
  },
}

type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'not found'

export { Language, LanguagesCount }
