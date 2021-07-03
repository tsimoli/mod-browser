export interface Tokens{
	accessToken: string, 
	refreshToken: string
}
export type TokensContextType = {
	tokens: Tokens | null, 
	saveTokens: (tokens: Tokens) => void | null
}