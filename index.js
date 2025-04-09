// Import required modules using CommonJS syntax
require('expo/build/Expo.fx');
const { registerRootComponent } = require('expo/build/launch/registerRootComponent');
const App = require('./App');

// Register the main App component
registerRootComponent(App);