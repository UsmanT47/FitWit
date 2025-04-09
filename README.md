# FitWit Health Journal App

FitWit is a comprehensive health journal app that uses AI to analyze your health data and provide personalized insights. Track your food, mood, exercise, sleep, and more to discover patterns and improve your well-being.

## Features

- **User Authentication:** Secure login/signup system
- **Daily Health Logging:** Track food, mood, exercise, sleep, and water intake
- **AI-Powered Insights:** Get personalized feedback and pattern detection
- **Customizable Dashboard:** View your health at a glance
- **Dark/Light Theme:** Choose your preferred visual style

## Building for Mobile

This app is designed specifically for mobile platforms (iOS and Android) and not for web use.

### Prerequisites

1. [Node.js](https://nodejs.org/) (LTS version recommended)
2. [Expo CLI](https://docs.expo.dev/get-started/installation/)
3. [EAS CLI](https://docs.expo.dev/build/setup/) for building native apps
4. [Xcode](https://developer.apple.com/xcode/) (for iOS builds)
5. [Android Studio](https://developer.android.com/studio) (for Android builds)

### Development

To run the development server:

```bash
npm start
```

This will start the Expo development server. You can then:
- Scan the QR code with the Expo Go app on your Android device
- Scan the QR code with your iPhone camera and follow the prompt
- Press 'a' to open on an Android emulator
- Press 'i' to open on an iOS simulator

### Building for Android

To build an APK for testing:

```bash
eas build -p android --profile preview
```

This will create an APK file that can be installed on Android devices for testing.

For a production-ready AAB file for Google Play:

```bash
eas build -p android --profile production
```

### Building for iOS

To build for iOS testing (requires an Apple Developer account):

```bash
eas build -p ios --profile preview
```

For a production build to submit to the App Store:

```bash
eas build -p ios --profile production
```

## Project Structure

- `/assets` - App icons and images
- `/src`
  - `/api` - API service functions
  - `/components` - Reusable UI components
  - `/constants` - App constants and theme definitions
  - `/context` - React context providers
  - `/navigation` - Navigation configuration
  - `/screens` - App screens
  - `/services` - Business logic services
  - `/utils` - Utility functions

## Testing Credentials

For testing purposes, you can use:
- Email: test@example.com
- Password: password123

## License

This project is licensed under the ISC License.