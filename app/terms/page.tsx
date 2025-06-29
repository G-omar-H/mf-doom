import Link from 'next/link'
import { ArrowLeft, FileText, Scale, CreditCard, Truck, Shield, AlertTriangle, Mail } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | THISMFDOOM',
  description: 'Terms of Service for THISMFDOOM - Rules and conditions for using our website and services.',
}

export default function TermsOfServicePage() {
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">TERMS OF SERVICE</h1>
              <p className="text-gray-600">The villain's code of conduct</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 m-0">Legal Agreement</h2>
            </div>
            <p className="text-gray-700 m-0">
              By accessing and using THISMFDOOM, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our website or services.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and THISMFDOOM 
                regarding your use of our website, products, and services. By using our website, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms.
              </p>
              
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
                posting on our website. Your continued use of the site after such changes constitutes acceptance 
                of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility and Account Registration</h2>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You must be at least 18 years old to make purchases</li>
                <li>Minors may use the site with parental consent and supervision</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to refuse service or terminate accounts at our discretion</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. Products and Pricing</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>All products are subject to availability</li>
                <li>We reserve the right to limit quantities purchased</li>
                <li>Product descriptions and images are for informational purposes</li>
                <li>Colors may vary due to monitor settings and photographic lighting</li>
                <li>We do not guarantee that products will meet your specific expectations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing and Payment</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All prices are in USD and subject to change without notice</li>
                <li>Prices do not include applicable taxes, which will be calculated at checkout</li>
                <li>We accept payment through PayPal and major credit/debit cards</li>
                <li>Payment must be received before order processing</li>
                <li>We reserve the right to refuse or cancel orders for any reason</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">4. Shipping and Delivery</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Policy</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Shipping costs are calculated based on destination and order value</li>
                <li>Free shipping is offered on orders over $100 (US only)</li>
                <li>International shipping is available to select countries</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss passes to you upon delivery to the carrier</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Issues</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You must provide accurate shipping information</li>
                <li>We are not responsible for delays caused by incorrect addresses</li>
                <li>Packages returned due to failed delivery attempts may incur additional fees</li>
                <li>Contact us within 30 days for any delivery issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Policy</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Returns are accepted within 30 days of delivery</li>
                <li>Items must be unused, unwashed, and in original condition</li>
                <li>Original tags and packaging must be included</li>
                <li>Return shipping costs are the customer's responsibility</li>
                <li>Custom or personalized items cannot be returned</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Process</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Refunds will be processed to the original payment method</li>
                <li>Processing time is 5-10 business days after we receive the return</li>
                <li>Shipping charges are non-refundable unless the return is our error</li>
                <li>Partial refunds may apply for items not in original condition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              
              <p className="text-gray-700 mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, and software, 
                is the property of THISMFDOOM or its licensors and is protected by copyright and other intellectual 
                property laws.
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You may not reproduce, distribute, or create derivative works without permission</li>
                <li>Product designs and artwork are licensed for personal use only</li>
                <li>Commercial use of our content is strictly prohibited</li>
                <li>We respect the intellectual property rights of others</li>
                <li>Report any copyright infringement to us immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Conduct</h2>
              
              <p className="text-gray-700 mb-4">When using our website, you agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Upload or transmit malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems to access or scrape our website</li>
                <li>Engage in any fraudulent or deceptive practices</li>
                <li>Post inappropriate or offensive content in reviews or comments</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">8. Disclaimers and Limitation of Liability</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Legal Notice</h3>
                <p className="text-gray-700 text-sm">
                  Our website and services are provided "as is" without any warranties. We disclaim all warranties, 
                  express or implied, including merchantability and fitness for a particular purpose.
                </p>
              </div>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for products</li>
                <li>Some jurisdictions do not allow limitation of warranties or liability</li>
                <li>These limitations may not apply to you if prohibited by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
              
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of your personal information is governed by 
                our <Link href="/privacy" className="text-mf-blue hover:underline font-semibold">Privacy Policy</Link>, 
                which is incorporated into these Terms by reference.
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We collect information necessary to provide our services</li>
                <li>We use industry-standard security measures to protect your data</li>
                <li>We do not sell your personal information to third parties</li>
                <li>You have rights regarding your personal data under applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend your account and access to our services at any time, 
                with or without cause, and with or without notice.
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You may terminate your account at any time by contacting us</li>
                <li>Upon termination, your right to use our services ceases immediately</li>
                <li>We may retain certain information as required by law or for legitimate business purposes</li>
                <li>Provisions that should survive termination will remain in effect</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Dispute Resolution</h2>
              
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the United States and the state where our business is located, 
                without regard to conflict of law principles.
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Any disputes will be resolved through binding arbitration</li>
                <li>You waive the right to participate in class action lawsuits</li>
                <li>Arbitration will be conducted under the rules of the American Arbitration Association</li>
                <li>Some jurisdictions may not allow these limitations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
              
              <p className="text-gray-700">
                We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable 
                control, including but not limited to natural disasters, war, terrorism, strikes, government regulations, 
                or pandemics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
              
              <p className="text-gray-700">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
                will continue to be valid and enforceable to the fullest extent permitted by law.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">14. Contact Information</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> legal@thismfdoom.shop</li>
                  <li><strong>Customer Service:</strong> support@thismfdoom.shop</li>
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
              "Honor the villain's code - respect the terms"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 