import { useState } from 'react';

export default function RazorpayPrivacyPolicy() {
  const [isAccepted, setIsAccepted] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-700 p-6">
        <h1 className="text-white text-2xl font-bold">Privacy Policy</h1>
        <p className="text-blue-100 mt-2">Payment Matching Service by Razorpay</p>
      </div>
      
      <div className="p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Introduction</h2>
          <p className="text-gray-600">
            This Privacy Policy explains how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of the Razorpay Payment Matching Service.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Information We Collect</h2>
          <p className="text-gray-600">
            When you use our Payment Matching Service, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Transaction information including amounts, dates, and merchant details</li>
            <li>Payment method information necessary to facilitate transactions</li>
            <li>Bank account details for payment verification and matching</li>
            <li>Contact information including email address and phone number</li>
            <li>Device and connection information when accessing our platform</li>
          </ul>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">How We Use Your Information</h2>
          <p className="text-gray-600">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>To process and verify payment transactions</li>
            <li>To match incoming payments with corresponding invoices or orders</li>
            <li>To detect and prevent fraudulent transactions</li>
            <li>To improve our payment matching algorithms and services</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To comply with legal obligations and regulatory requirements</li>
          </ul>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Data Sharing and Disclosure</h2>
          <p className="text-gray-600">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Banking partners to facilitate payment processing</li>
            <li>Third-party service providers who assist in operating our services</li>
            <li>Regulatory authorities when required by law</li>
            <li>Your merchant or business account administrator</li>
          </ul>
          <p className="text-gray-600">
            We do not sell your personal information to third parties.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. Our security measures include encryption, access controls, and regular security assessments.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Rights</h2>
          <p className="text-gray-600">
            Depending on your location, you may have rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
          </ul>
          <p className="text-gray-600">
            To exercise these rights, please contact our privacy team at privacy@razorpay.com.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="text-gray-600">
            <p>Razorpay Software Private Limited</p>
            <p>No. 808, 8th Floor, Prestige Meridian 1</p>
            <p>M.G. Road, Bangalore - 560001</p>
            <p>Karnataka, India</p>
            <p>Email: privacy@razorpay.com</p>
          </div>
        </section>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <input 
              id="accept-policy" 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isAccepted}
              onChange={() => setIsAccepted(!isAccepted)}
            />
            <label htmlFor="accept-policy" className="ml-2 block text-sm text-gray-700">
              I have read and agree to the Privacy Policy
            </label>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className={`px-6 py-2 rounded-md font-medium text-white ${
                isAccepted 
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isAccepted}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-xs text-gray-500">
          Last Updated: April 17, 2025 • Razorpay Software Private Limited
        </p>
      </div>
    </div>
  );
}