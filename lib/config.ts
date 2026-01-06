// Centralized configuration for the application

export const config = {
  // Business contact information
  business: {
    name: 'Masasa Aesthetics',
    whatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || '+26663149604',
    whatsappDisplay: '+266 63 149 604',
  },
  
  // Shipping configuration
  shipping: {
    paxiFee: 40,
    supportedCountries: [
      { code: 'ZA', name: 'South Africa', hasPaxi: true },
      { code: 'LS', name: 'Lesotho', hasPaxi: false },
      { code: 'SZ', name: 'Eswatini', hasPaxi: false },
      { code: 'BW', name: 'Botswana', hasPaxi: false },
      { code: 'NA', name: 'Namibia', hasPaxi: false },
      { code: 'MZ', name: 'Mozambique', hasPaxi: false },
      { code: 'ZW', name: 'Zimbabwe', hasPaxi: false },
    ],
  },
  
  // Currency
  currency: {
    code: 'ZAR',
    symbol: 'R',
  },
} as const;

// Helper to check if country requires PAXI
export function requiresPaxi(country: string): boolean {
  const normalizedCountry = country.toLowerCase().trim();
  return (
    normalizedCountry === 'south africa' ||
    normalizedCountry === 'za' ||
    normalizedCountry === 'rsa'
  );
}

// Get country by code or name
export function getCountryInfo(countryInput: string) {
  const normalized = countryInput.toLowerCase().trim();
  return config.shipping.supportedCountries.find(
    (c) => c.code.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );
}
