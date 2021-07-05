import { get, save } from './Storage'
import { newGuid } from '../utils/Utils'

export const makeAndGetUniqueId = async () => {
  const existingUniqueId = await get<string>('uniqueId')

  if (existingUniqueId != null) {
    return existingUniqueId
  }

  const uniqueId = newGuid()
  await save('uniqueId', uniqueId)
  return uniqueId
}
