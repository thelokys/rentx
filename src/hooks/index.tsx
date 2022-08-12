import React, { ReactNode } from 'react'

import { AuthProvider } from './auth'

interface AuthProviderProps {
  children: ReactNode
}

const AppProvider = ({children}: AuthProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export { AppProvider }