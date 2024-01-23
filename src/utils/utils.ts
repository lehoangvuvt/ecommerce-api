import shortid from 'shortid'

const removeDiacriticalMarks = (input: string) => {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const slugGenerator = (value: string) => {
  let slug = value
    .split(' ')
    .reduce((prevValue, currentValue) => `${prevValue}-${currentValue}`, '')
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
  return removeDiacriticalMarks(slug.substring(1)).toLowerCase() + `-${shortid.generate()}`
}

export { slugGenerator, removeDiacriticalMarks }
