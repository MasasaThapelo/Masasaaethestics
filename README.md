# Masasa Aesthetics - E-commerce Platform

A modern Next.js e-commerce platform for custom phone cases with WhatsApp and email order confirmations.

## Features

- **Product Catalog**: Browse phone cases by design category (Botanical Blossom, White Heaven, Strawberry Shortcake) and phone model
- **Shopping Cart**: Add products with customization options (initials/special requests)
- **Checkout**: Complete checkout process with customer information and shipping details
- **South African Support**: Special PAXI delivery option for SA customers with R40 fee
- **Order Confirmation**: Automated WhatsApp and email confirmations
- **Responsive Design**: Mobile-first, professional UI/UX

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Email Service**: Resend
- **WhatsApp Integration**: Twilio WhatsApp API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_NUMBER=63149604
BUSINESS_WHATSAPP_NUMBER=63149604

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /page.tsx                 # Landing page with carousel
  /products
    /page.tsx               # Product listing with filters
    /[id]/page.tsx          # Product detail page
  /cart/page.tsx            # Shopping cart
  /checkout/page.tsx        # Checkout page
  /order-confirmation/[orderId]/page.tsx  # Order confirmation
  /api
    /orders/route.ts        # Order processing API
/components
  /Carousel.tsx             # Product carousel component
  /ProductCard.tsx          # Product card component
  /CartContext.tsx          # Cart state management
  /Header.tsx               # Navigation header
  /PaymentInstructions.tsx  # Payment instructions component
  /SAShippingNotice.tsx     # SA shipping notice component
/data
  /products.ts              # Product data
/lib
  /whatsapp.ts              # WhatsApp utility functions
  /email.ts                 # Email utility functions
```

## Key Features Implementation

### Product Customization
Customers can add initials or special requests when adding products to cart.

### Payment Instructions
Clear instructions displayed at checkout requiring customers to send proof of payment via WhatsApp.

### South African Customers
Special handling for SA customers:
- Additional R40 PAXI delivery fee
- PAXI code input field
- Confirmation checkbox

### Order Confirmations
- Automated WhatsApp message to customer
- Automated WhatsApp notification to business
- Automated email confirmation to customer

## Environment Variables

See `.env.example` for required environment variables.

## Notes

- Orders are currently stored in memory (will be lost on server restart)
- For production, implement a database (PostgreSQL, MongoDB, etc.)
- Configure WhatsApp and email services for automated confirmations
- Replace placeholder product images with actual product photos

## License

ISC

# Masasaaethestics
