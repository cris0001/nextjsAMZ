import { createContext, useReducer } from "react";

interface ThemeContext {
  darkMode: boolean;
}

const initalState: ThemeContext = {
  darkMode: true,
};
export const Store = createContext<ThemeContext>(initalState);

export default function reducer(state: any, action: any) {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

export function StoreProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initalState);
  const value = { state, dispatch };

  return <StoreProvider value={value}>{children}</StoreProvider>;
}
