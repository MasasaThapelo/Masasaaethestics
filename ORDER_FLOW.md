# Order Flow & Notification System

## What Happens When "Place Order" is Clicked

### 1. Frontend (Checkout Page)
- User fills out checkout form
- Clicks "Place Order" button
- Form data is validated (especially PAXI fee for SA customers)
- Order data is sent to `/api/orders` endpoint

### 2. Backend (API Route: `/api/orders`)
The order processing happens in `app/api/orders/route.ts`:

1. **Order Validation**: Checks for required fields (name, email, phone, items)
2. **Order Creation**: 
   - Generates unique order ID (format: `ORD-{timestamp}-{random}`)
   - Creates order object with all details
   - Stores order in memory (⚠️ will be lost on server restart)
3. **Notifications Sent** (in parallel, non-blocking):
   - ✅ WhatsApp message to customer
   - ✅ WhatsApp message to business (63149604)
   - ✅ Email confirmation to customer
4. **Response**: Returns order ID to frontend

### 3. Frontend (After Order)
- Cart is cleared
- User is redirected to order confirmation page
- Order details are displayed

## Current Notification Status

### WhatsApp Notifications
**Status**: Currently only logs messages (not actually sending)

**To Enable Real WhatsApp Messages:**
1. Option A: Use Twilio WhatsApp API
   - Get Twilio account credentials
   - Set environment variables:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid
     TWILIO_AUTH_TOKEN=your_auth_token
     WHATSAPP_NUMBER=63149604
     BUSINESS_WHATSAPP_NUMBER=63149604
     ```

2. Option B: Use WhatsApp Business API
   - Configure WhatsApp Business API
   - Set environment variable:
     ```
     WHATSAPP_API_KEY=your_api_key
     ```

**What Gets Sent:**
- **To Customer**: Order confirmation with details and payment instructions
- **To Business**: New order notification with customer and order details

### Email Notifications
**Status**: Currently only logs emails (not actually sending)

**To Enable Real Emails:**
1. Sign up for Resend (https://resend.com)
2. Get your API key
3. Set environment variables:
   ```
   RESEND_API_KEY=re_your_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ```

**What Gets Sent:**
- Professional HTML email with order details
- Payment instructions
- Order summary

## Environment Variables Needed

Create a `.env.local` file in the root directory:

```env
# WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_NUMBER=63149604
BUSINESS_WHATSAPP_NUMBER=63149604

# OR WhatsApp Business API
# WHATSAPP_API_KEY=your_whatsapp_api_key

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

## Important Notes

1. **Order Storage**: Currently orders are stored in memory and will be lost when the server restarts. For production, you should:
   - Use a database (PostgreSQL, MongoDB, etc.)
   - Store orders persistently

2. **Error Handling**: Notification failures don't block order creation. Orders are saved even if notifications fail.

3. **Phone Number Format**: WhatsApp numbers should include country code (e.g., +26663149604 for Lesotho)

4. **Testing**: Without API keys configured, notifications are logged to the console for testing.

