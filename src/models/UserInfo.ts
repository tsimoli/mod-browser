export interface Tokens {
  accessToken: string
  renewalToken: string
}

export type UserInfoContextType = {
  tokens: Tokens | null
  uniqueId: string | null
  saveTokens: (tokens: Tokens) => void | null
  saveUniqueId: (uniqueId: string) => void | null
}
