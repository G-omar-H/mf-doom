'use client'

import React, { useEffect, useState } from 'react'

export const PayPalDebug: React.FC = () => {
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')
  const [clientId, setClientId] = useState<string>('')
  const [environment, setEnvironment] = useState<string>('')

  useEffect(() => {
    // Get environment info
    setClientId(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'NOT_SET')
    setEnvironment(process.env.PAYPAL_ENVIRONMENT || 'NOT_SET')

    // Test PayPal SDK loading
    const testPayPalSDK = () => {
      const script = document.createElement('script')
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      
      if (!clientId) {
        setError('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set')
        setSdkStatus('error')
        return
      }

      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&enable-funding=venmo,paylater,card&buyer-country=US&locale=en_US`
      
      script.onload = () => {
        setSdkStatus('success')
        console.log('✅ PayPal SDK loaded successfully')
      }
      
      script.onerror = (e) => {
        setSdkStatus('error')
        setError(`Failed to load PayPal SDK: ${e}`)
        console.error('❌ PayPal SDK failed to load:', e)
      }

      document.head.appendChild(script)
    }

    testPayPalSDK()
  }, [])

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown'

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">PayPal SDK Debug Information</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Environment Information</h3>
          <div className="space-y-1 text-sm font-mono">
            <p><strong>Current Domain:</strong> {currentDomain}</p>
            <p><strong>Client ID:</strong> {clientId.substring(0, 20)}...</p>
            <p><strong>Environment:</strong> {environment}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{
          backgroundColor: sdkStatus === 'success' ? '#dcfce7' : sdkStatus === 'error' ? '#fef2f2' : '#fef3c7',
          borderColor: sdkStatus === 'success' ? '#16a34a' : sdkStatus === 'error' ? '#dc2626' : '#d97706'
        }}>
          <h3 className="font-semibold mb-2">
            PayPal SDK Status: {sdkStatus.toUpperCase()}
          </h3>
          {error && (
            <p className="text-sm text-red-600 font-mono">{error}</p>
          )}
          {sdkStatus === 'success' && (
            <p className="text-sm text-green-600">✅ PayPal SDK loaded successfully</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Required PayPal Setup Steps</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Add domain to PayPal Developer App settings</li>
            <li>Enable domain in PayPal Business Account</li>
            <li>Ensure HTTPS is properly configured</li>
            <li>Verify environment variables are set correctly</li>
          </ol>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <h3 className="font-semibold mb-2">If SDK Still Fails to Load</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Check browser DevTools Network tab for specific error</li>
            <li>Verify PayPal app is in "Live" mode (not sandbox)</li>
            <li>Ensure domain exactly matches PayPal app settings</li>
            <li>Try with and without 'www' prefix</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PayPalDebug 