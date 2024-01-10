import shortid from 'shortid'

const slugGenerator = (value: string) => {
  let slug = value
    .split(' ')
    .reduce((prevValue, currentValue) => `${prevValue}-${currentValue}`, '')
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
  return (
    slug
      .substring(1)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase() + `-${shortid.generate()}`
  )
}

export { slugGenerator }
