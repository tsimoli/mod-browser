export interface Tokens {
  access_token: string
  renewal_token: string
}

export type UserInfoContextType = {
  tokens: Tokens | null
  uniqueId: string | null
  saveTokens: (tokens: Tokens) => void | null
  saveUniqueId: (uniqueId: string) => void | null
}
