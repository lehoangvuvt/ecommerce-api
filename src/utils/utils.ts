import shortid from 'shortid'

const removeDiacriticalMarks = (input: string) => {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const slugGenerator = (value: string, type: 'category' | 'product') => {
  let typeSlugSuffix = ''
  switch (type) {
    case 'category':
      typeSlugSuffix = '-cat'
      break
    case 'product':
      typeSlugSuffix = '-i'
      break
  }

  let slug = value
    .split(' ')
    .reduce((prevValue, currentValue) => `${prevValue}-${currentValue}`, '')
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
  return removeDiacriticalMarks(slug.substring(1)).toLowerCase() + typeSlugSuffix + `.${shortid.generate()}`
}

export { slugGenerator, removeDiacriticalMarks }
