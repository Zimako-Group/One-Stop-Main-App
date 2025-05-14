# One-Stop Mobile App

A comprehensive mobile utility application for Eswatini, allowing users to manage accounts, purchase airtime/data, pay bills, and transfer money between different payment systems.

![One-Stop App](./assets/images/app-logo.png)

## Features

### Authentication
- Secure login and signup with phone number as primary identifier
- SMS-based OTP verification for enhanced security
- Profile management with customizable profile images
- Biometric authentication support

### Wallet & Payments
- MTN MoMo integration for wallet functionality
- Multiple payment methods (MoMo, e-Mali, e-Wallet, FNB)
- Top-up functionality via MTN MoMo or bank transfer
- Transaction history with filtering options
- Bank card integration with multiple card type support

### Services
- Airtime purchase with custom amounts
- Data bundle purchase with package selection
- Bill payments for utilities and services
- Money transfers between different payment systems
- QR code scanning for payments

### User Interface
- Modern UI with animations using React Native Reanimated
- Tab-based navigation with animated tab bar
- Linear gradients for visual styling
- Card-based UI with blue color scheme
- Comprehensive settings page

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **SMS**: Infobip API for OTP delivery
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: React Native Reanimated

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Zimako-Dev/One-Stop-Main-App.git
cd One-Stop-Main-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_INFOBIP_API_KEY=your_infobip_api_key
EXPO_PUBLIC_INFOBIP_BASE_URL=your_infobip_base_url
EXPO_PUBLIC_INFOBIP_SENDER=your_infobip_sender_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
One-Stop-Main-App/
├── app/                  # Expo Router app directory
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main app tabs
│   └── ...               # Other app screens
├── assets/               # Images, fonts, and other static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service integrations
│   └── utils/            # Utility functions
├── .env                  # Environment variables (not in git)
└── package.json          # Project dependencies and scripts
```

## Authentication Flow

1. **Login**: Users enter their phone number and password
2. **OTP Verification**: Upon successful authentication, an OTP is sent to the user's phone
3. **Verification**: User enters the 6-digit code received via SMS
4. **Access**: Upon successful verification, user gains access to the app

## Key Features in Detail

### OTP Verification
- 6-digit OTP sent via Infobip SMS API
- 5-minute expiry time for security
- 3 retry attempts before requiring a new OTP
- Daily verification to balance security and convenience

### Wallet System
- Balance tracking and display
- Transaction history with expandable details
- Top-up functionality via multiple payment methods
- Fee calculation for different payment methods

### Mobile Services
- Network provider selection (MTN Eswatini, Eswatini Mobile)
- Service type selection (Airtime, Data Bundle)
- Custom amount input for airtime purchases
- Package selection for data bundles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [Infobip](https://www.infobip.com/)
- [MTN MoMo](https://momoapi.mtn.com/)

# EAS Preview Build Command

npx eas build --platform android --profile preview
