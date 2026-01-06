import { config } from '@/lib/config';

export default function PaymentInstructions() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">IMPORTANT: Payment Instructions</h3>
          <p className="text-yellow-700">
            Once you&apos;ve placed your order, please send proof of payment to our WhatsApp number: <strong>{config.business.whatsappDisplay}</strong>. Your order will only be processed once proof of payment is received via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

