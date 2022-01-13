import useEthereum from 'hooks/useEthereum'
import useWallet from 'hooks/useWallet'
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
  const account = useWallet()
  console.log({ account })

  const auth = { authUser: 'bob', isLoading: false }

  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  )
}

export const useAuth = () => useContext(authUserContext)
