import * as React from 'react'
import { Tokens, UserInfoContextType } from '../models/UserInfo'

export const UserInfoContext = React.createContext<UserInfoContextType>(null)
export const useUserInfo = () => React.useContext(UserInfoContext)
import { get, save } from '../storage/Storage'

export const UserInfoProvider = ({ children }): JSX.Element => {
  const [tokens, setTokens] = React.useState<Tokens>(null)
  const [uniqueId, setUniqueId] = React.useState<string>(null)

  const saveTokens = async (newTokens: Tokens) => {
    async function saveToken(tokens) {
      await save('tokens', tokens)
    }
    await saveToken(newTokens)
    setTokens(newTokens)
  }

  const saveUniqueId = async (uniqueId: string) => {
    async function saveUniqueId(uniqueId) {
      await save('uniqueId', uniqueId)
    }
    await saveUniqueId(uniqueId)
    setUniqueId(uniqueId)
  }

  React.useEffect(() => {
    async function getToken() {
      const tokens = await get<Tokens>('tokens')
      setTokens(tokens)
    }
    if (tokens == null) getToken()
  }, [])

  return (
    <UserInfoContext.Provider
      value={{ tokens, saveTokens, uniqueId, saveUniqueId }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}
