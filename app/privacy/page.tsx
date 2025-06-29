import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Globe } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | THISMFDOOM',
  description: 'Privacy Policy for THISMFDOOM - How we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-mf-blue hover:text-mf-dark-blue transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">PRIVACY POLICY</h1>
              <p className="text-gray-600">Protecting your villain identity</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-mf-blue/10 border border-mf-blue/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-mf-blue" />
              <h2 className="text-xl font-bold text-gray-900 m-0">Your Privacy Matters</h2>
            </div>
            <p className="text-gray-700 m-0">
              At THISMFDOOM, we respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">When you make a purchase or create an account, we collect:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name and contact information (email, phone, address)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through PayPal)</li>
                <li>Order history and preferences</li>
                <li>Account credentials (email and encrypted password)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Automatic Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Website usage patterns and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Order Processing:</strong> To fulfill your orders, process payments, and provide customer service</li>
                <li><strong>Account Management:</strong> To create and maintain your account, wishlist, and order history</li>
                <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer support</li>
                <li><strong>Marketing:</strong> To send promotional emails (only with your consent)</li>
                <li><strong>Analytics:</strong> To improve our website, products, and user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
              </div>
              
              <p className="text-gray-700 mb-4">We do not sell, trade, or rent your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> PayPal for payments, shipping companies for delivery</li>
                <li><strong>Analytics Providers:</strong> Google Analytics (anonymized data only)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <p className="text-gray-700 mb-4">We protect your information using industry-standard security measures:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through PayPal</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Password encryption and secure authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                <li><strong>Delete:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Portability:</strong> Export your data in a readable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies Policy</h2>
              
              <p className="text-gray-700 mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Remember your shopping cart and preferences</li>
                <li>Keep you logged in to your account</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p className="text-gray-700 mt-4">You can control cookies through your browser settings, but disabling them may affect website functionality.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              
              <p className="text-gray-700 mb-4">Our website integrates with:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>PayPal:</strong> For secure payment processing</li>
                <li><strong>Instagram:</strong> For social media content</li>
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Email Services:</strong> For order confirmations and marketing</li>
              </ul>
              <p className="text-gray-700 mt-4">These services have their own privacy policies and may collect information independently.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Users</h2>
              
              <p className="text-gray-700">
                Our services are based in the United States. If you access our website from outside the US, 
                your information may be transferred to, stored, and processed in the US where our servers are located.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              
              <p className="text-gray-700">
                Our website is not directed to children under 13. We do not knowingly collect personal information 
                from children under 13. If you believe a child has provided us with personal information, 
                please contact us and we will delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on this page and updating the "Last Updated" date below.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-700 mb-4">If you have questions about this Privacy Policy or want to exercise your rights, contact us:</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> privacy@thismfdoom.shop</li>
                  <li><strong>Instagram:</strong> @thismfdoom_</li>
                  <li><strong>Website:</strong> <Link href="/" className="text-mf-blue hover:underline">thismfdoom.shop</Link></li>
                </ul>
              </div>
            </section>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500 text-center">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-gray-600 text-center mt-4 italic">
              "Your privacy is protected like the villain's mask"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 