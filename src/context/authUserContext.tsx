import useConnectWallet from 'hooks/useConnectWallet'
import { createContext, useContext, FC } from 'react'

interface authUserContextInterface {
  authUser: any
  isLoading: boolean
}

const authUserContext = createContext<authUserContextInterface>({
  authUser: null,
  isLoading: true
})

export const AuthUserProvider: FC = ({ children }) => {
  const account = useConnectWallet()

  const auth = { authUser: 'bob', isLoading: false }

  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  )
}

export const useAuth = () => useContext(authUserContext)
