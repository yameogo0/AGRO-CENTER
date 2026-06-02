import { http } from './client'
import { BACKEND_URLS } from './endpoints'
import type { PiTransaction } from './types'

export const piApi = {
  verifyPayment: (paymentId: string) => http.post(BACKEND_URLS.PI_VERIFY, { paymentId }),
  getWallet: () => http.get<{ balance: number; address: string }>(BACKEND_URLS.PI_WALLET),
  getTransactions: () => http.get<PiTransaction[]>(BACKEND_URLS.PI_TRANSACTIONS),
  sendPayment: (to: string, amount: number, memo?: string) =>
    http.post(BACKEND_URLS.PI_PAYMENT, { to, amount, memo }),
}