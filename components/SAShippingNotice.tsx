'use client';

import { config } from '@/lib/config';

interface SAShippingNoticeProps {
  isSA: boolean;
  paxiCode: string;
  onPaxiCodeChange: (code: string) => void;
  paxiFeeConfirmed: boolean;
  onPaxiFeeConfirmedChange: (confirmed: boolean) => void;
}

export default function SAShippingNotice({
  isSA,
  paxiCode,
  onPaxiCodeChange,
  paxiFeeConfirmed,
  onPaxiFeeConfirmedChange,
}: SAShippingNoticeProps) {
  if (!isSA) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">For South African Customers</h3>
          <p className="text-blue-700 mb-4">
            Please pay an additional <strong>{config.currency.symbol}{config.shipping.paxiFee}</strong> for PAXI delivery. Once paid, send proof of payment, your name, and order details to WhatsApp: <strong>{config.business.whatsappDisplay}</strong>.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="paxi-code" className="block text-sm font-medium text-blue-900 mb-2">
                PAXI Code:
              </label>
              <input
                type="text"
                id="paxi-code"
                value={paxiCode}
                onChange={(e) => onPaxiCodeChange(e.target.value)}
                placeholder="Enter your PAXI number"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="paxi-fee-confirmed"
                checked={paxiFeeConfirmed}
                onChange={(e) => onPaxiFeeConfirmedChange(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
              />
              <label htmlFor="paxi-fee-confirmed" className="ml-2 text-sm text-blue-900">
                I confirm I&apos;ve added the {config.currency.symbol}{config.shipping.paxiFee} PAXI fee
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

