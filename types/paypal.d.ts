declare module '@paypal/react-paypal-js' {
  import { ReactNode, FC } from 'react'

  export interface PayPalScriptOptions {
    clientId: string
    currency?: string
    intent?: string
    'enable-funding'?: string
    'disable-funding'?: string
    'data-sdk-integration-source'?: string
  }

  export interface PayPalButtonsStyleOptions {
    layout?: 'vertical' | 'horizontal'
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
    shape?: 'rect' | 'pill'
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment'
    height?: number
    tagline?: boolean
  }

  export interface PayPalButtonsProps {
    disabled?: boolean
    style?: PayPalButtonsStyleOptions
    createOrder?: () => Promise<string>
    onApprove?: (data: { orderID: string; payerID?: string }) => Promise<void>
    onError?: (error: unknown) => void
    onCancel?: () => void
  }

  export interface PayPalScriptProviderProps {
    options: PayPalScriptOptions
    children: ReactNode
  }

  export const PayPalScriptProvider: FC<PayPalScriptProviderProps>
  export const PayPalButtons: FC<PayPalButtonsProps>
} 