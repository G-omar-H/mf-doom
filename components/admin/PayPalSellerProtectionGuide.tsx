'use client'

import React from 'react'
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Truck } from 'lucide-react'

export const PayPalSellerProtectionGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">PayPal Seller Protection Guide</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Why It's Critical */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-lg font-semibold text-red-900">Why This Is Critical</h3>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-red-800">
              <li>• PayPal sides with buyers in 95% of "Item Not Received" disputes</li>
              <li>• Without tracking, you WILL lose the money + item</li>
              <li>• Multiple disputes can freeze your entire PayPal account</li>
              <li>• PayPal may hold funds or apply reserves to risky accounts</li>
              <li>• Account limitations can shut down your business</li>
            </ul>
          </div>
        </div>

        {/* How to Stay Protected */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <h3 className="text-lg font-semibold text-green-900">How to Stay Protected</h3>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Add tracking within 24 hours of shipping</li>
              <li>• Use reputable carriers (USPS, UPS, FedEx, DHL)</li>
              <li>• Ship to the EXACT address PayPal provides</li>
              <li>• Keep shipping receipts and delivery confirmations</li>
              <li>• Update PayPal when packages are delivered</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step by Step Process */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Required Process for Every Order</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h4 className="font-semibold text-blue-900">Ship the Item</h4>
            </div>
            <p className="text-sm text-blue-800">Use a real carrier and get a tracking number. Ship to the exact address provided by PayPal.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h4 className="font-semibold text-green-900">Add Tracking</h4>
            </div>
            <p className="text-sm text-green-800">Add the tracking number in the order admin. This automatically sends it to PayPal for protection.</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <h4 className="font-semibold text-purple-900">Monitor Delivery</h4>
            </div>
            <p className="text-sm text-purple-800">Track the package and mark as delivered when it arrives. This completes your protection.</p>
          </div>
        </div>
      </div>

      {/* Supported Carriers */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Supported Shipping Carriers</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'USPS', 'UPS', 'FedEx', 'DHL',
            'Aramex', 'Chronopost', 'TNT', 'Other'
          ].map((carrier) => (
            <div key={carrier} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
              <Truck size={16} className="text-gray-600" />
              <span className="text-sm font-medium">{carrier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">⚠️ Important Notes</h3>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>• This system works automatically - just add tracking and you're protected</li>
          <li>• PayPal requires tracking for items over $250 with signature confirmation</li>
          <li>• The shipping address must match exactly what PayPal provides</li>
          <li>• Keep all shipping receipts until 180 days after delivery</li>
          <li>• For high-value items, consider requiring signature confirmation</li>
        </ul>
      </div>

      {/* Resources */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            This system protects you from PayPal disputes and account holds
          </span>
          <a
            href="https://www.paypal.com/us/webapps/mpp/security/seller-protection"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            PayPal Seller Protection Policy
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PayPalSellerProtectionGuide 