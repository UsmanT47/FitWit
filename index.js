// Import using ES6 syntax for consistency with App.js
import 'expo/build/Expo.fx';
import { registerRootComponent } from 'expo/build/launch/registerRootComponent';
import App from './App';

// Register the main App component
registerRootComponent(App);