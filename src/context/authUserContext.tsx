import { createContext, useContext } from 'react'

const authUserContext = createContext({
  authUser: null,
  isLoading: true
})

export const AuthUserProvider = ({ children }) => {
  const auth = { authUser: 'bob', isLoading: false }

  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  )
}

export const useAuth = () => useContext(authUserContext)
