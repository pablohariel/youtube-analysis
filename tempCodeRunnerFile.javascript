const phrase = 'ola tudo bom, como, vai vocẽ?'

console.log(phrase.split(',').join(' , ').split('?').join(' ? ').split('.').join(' . ').split(' ').filter(word => word.length > 0 && word))