import { ProviderData, SchemaMap } from '../types'

const getLinkedData = (providerData: ProviderData, schemasMap?: SchemaMap): any => {
  const linkedData = {}
  const allEntities = providerData?.entities || []
  const allConnections = providerData?.connections || {}
  const entitiesById: { [key: string]: any } = {}

  for (const entity of allEntities) {
    // AddawsEc2Input! => queryawsEc2
    const mutationName = /(?<=\[)(.*?)(?=\])/
      .exec(entity.mutation as any)[0]
      .replace('Add', 'query')
      .replace('Input!', '')

    linkedData[mutationName] = entity.data

    for (const entityData of entity.data) {
      entitiesById[entityData.id] = entityData
      // eslint-disable-next-line no-underscore-dangle
      entityData.__typename = mutationName.replace('query', '') // or entity.name?
    }
  }

  // connect data on a second pass
  for (const entityId of Object.keys(allConnections)) {
    const entityConnections = allConnections[entityId]
    const entity = entitiesById[entityId]
    if (!entity) {
      // eslint-disable-next-line no-continue
      continue
    }
    for (const conn of entityConnections) {
      const targetEntity = entitiesById[conn.id]
      if (!targetEntity) {
        // eslint-disable-next-line no-continue
        continue
      }
      if (conn.relation === 'child') {
        if (!entity[conn.field]) {
          entity[conn.field] = []
        }
        entity[conn.field].push(targetEntity)
        // inverse relation
        // eslint-disable-next-line no-underscore-dangle
        const inverseConnField = schemasMap && schemasMap[entity.__typename] || 'account' // @TODO: account doesn't have a name
        if (!targetEntity[inverseConnField]) {
          targetEntity[inverseConnField] = []
        }
        targetEntity[inverseConnField].push(entity)
      } // else parent relation.. is not used atm
    }
  }

  return linkedData
}

export default getLinkedData
