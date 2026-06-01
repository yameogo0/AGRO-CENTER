import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Pi?: any
  }
}

interface PiWalletState {
  isAuthenticated: boolean
  user: any | null
  balance: number | null
  loading: boolean
  error: string | null
}

export function usePiWallet() {
  const [state, setState] = useState<PiWalletState>({
    isAuthenticated: false,
    user: null,
    balance: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const initPi = async () => {
      try {
        // Vérifier si on est dans Pi Browser
        if (typeof window !== 'undefined' && window.Pi) {
          const Pi = window.Pi
          await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV !== 'production' })
          
          const auth = await Pi.authenticate(['username', 'wallet_address'], { 
            onIncomplete: () => {} 
          })
          
          if (auth) {
            setState({
              isAuthenticated: true,
              user: auth.user,
              balance: auth.user?.piCoins || 0,
              loading: false,
              error: null,
            })
          } else {
            setState(prev => ({ ...prev, loading: false, error: 'Authentification annulée' }))
          }
        } else {
          // Mode développement : simulation
          if (process.env.NODE_ENV === 'development') {
            setState({
              isAuthenticated: true,
              user: { username: 'dev_user', uid: 'dev' },
              balance: 15.78,
              loading: false,
              error: null,
            })
          } else {
            setState(prev => ({ ...prev, loading: false, error: 'Pi Browser requis' }))
          }
        }
      } catch (err: any) {
        setState(prev => ({ ...prev, loading: false, error: err.message }))
      }
    }

    initPi()
  }, [])

  const sendPayment = async (to: string, amount: number, memo?: string) => {
    if (!state.isAuthenticated) throw new Error('Non authentifié')
    try {
      const Pi = window.Pi
      const payment = await Pi.createPayment({
        amount,
        memo: memo || 'Paiement Agro MultiCenter',
        metadata: { to },
      })
      await payment.submit()
      return payment
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  return { ...state, sendPayment }
}