import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { print } from 'graphql'
import path from 'path'

import { EntityMutations } from '../types'

export const mergeSchemas = (currSchema: string, additions: string[]) => {
  const s = mergeTypeDefs([currSchema, ...additions])
  return print(s)
}

export function getSchemaFromFolder(
  dirPath: string,
  provider?: string
): string {
  const typesArray = loadFilesSync(
    path.join(dirPath, provider ? `${provider}*` : ''),
    {
      extensions: ['graphql'],
    }
  )
  return print(mergeTypeDefs(typesArray))
}

export const generateSchemaMapDynamically = (
  provider: string,
  resources: string[]
): { [schemaName: string]: string } => {
  const resourceTypeNamesToFieldsMap: { [schemaName: string]: string } = {}

  for (const resource of resources) {
    const schemaName = `${provider}${resource
      .charAt(0)
      .toUpperCase()}${resource.slice(1)}`

    resourceTypeNamesToFieldsMap[resource] = schemaName
  }
  return resourceTypeNamesToFieldsMap
}

const generateDeleteMutation = (schemaName: string): string =>
  `mutation delete${schemaName}($input: [String!]!){delete${schemaName}(filter: { id: { in: $input }}) { numUids } }`

const generateUpsertMutation = (schemaName: string): string =>
  `mutation($input: [Add${schemaName}Input!]!) { add${schemaName}(input: $input, upsert: true) { numUids } }`

export const generateEntityMutations = (
  schemaName: string
): EntityMutations => {
  return {
    upsert: generateUpsertMutation(schemaName),
    delete: generateDeleteMutation(schemaName),
  }
}
