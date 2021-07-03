import * as React from "react";
import { Tokens, TokensContextType } from "../shape/token";

export const TokenContext = React.createContext<TokensContextType>(null);
export const useTokens = () => React.useContext(TokenContext);
import { get, save } from "../storage/Storage";

export const TokenProvider = ({ children }): JSX.Element => {
  const [tokens, setTokens] = React.useState<Tokens>(null);

  const saveTokens = async (newTokens: Tokens) => {
    async function saveToken(tokens) {
      await save("tokens", tokens);
    }
    await saveToken(newTokens);
    setTokens(newTokens);
  };

  React.useEffect(() => {
    async function getToken() {
      const tokens = await get<Tokens>("tokens");
      setTokens(tokens);
    }
    if (tokens == null) getToken();
  }, []);

  return (
    <TokenContext.Provider value={{ tokens, saveTokens }}>
      {children}
    </TokenContext.Provider>
  );
};
