import crypto from 'crypto'
import camelCase from 'lodash/camelCase'

export const toCamel = (o: any): any => {
  let origKey
  let newKey
  let value

  if (o instanceof Array) {
    return o.map(value => {
      if (typeof value === 'object') {
        value = toCamel(value)
      }
      return value
    })
  }

  const newObject = {}
  for (origKey in o) {
    if (o.hasOwnProperty(origKey)) {
      newKey = camelCase(origKey)
      value = o[origKey]
      if (
        value instanceof Array ||
        (value !== null && value !== undefined && value.constructor === Object)
      ) {
        value = toCamel(value)
      }
      newObject[newKey] = value
    }
  }

  return newObject
}

export const getKeyByValue = (
  object: Record<string, unknown>,
  value: any
): string | undefined => {
  return Object.keys(object).find(key => object[key] === value)
}

export const intersectStringArrays = (
  a: Array<string>,
  b: Array<string>
): Array<string> => {
  const setA = new Set(a)
  const setB = new Set(b)
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  return Array.from(intersection)
}

/**
 * Sorts a services list depending on his dependencies
 * @param relationsMap share data services map
 * @param resourceNames services to sort
 * @returns sorted list of services
 */
export const sortResourcesDependencies = (
  relationsMap: { [parent: string]: string[] },
  resourceNames: string[]
): string[] =>
  resourceNames.sort((prevResource, nextResource) => {
    const dependecies = relationsMap[prevResource]

    if (dependecies && dependecies.includes(nextResource)) {
      return -1
    }
    return 0
  })

/**
 * Create an unique hash identifier
 * @param entity entire entity to create identifier
 * @returns unique identifier
 */
export const generateUniqueId = (entity: any): string =>
  crypto.createHash('md5').update(JSON.stringify(entity)).digest('hex')
