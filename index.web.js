import 'expo/build/Expo.fx';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { createRoot } from 'react-dom/client';
import App from './App';

// Register the main App component
registerRootComponent(App);

// For web, we need to manually set up the root
if (module.hot) {
  module.hot.accept();
}

const root = createRoot(document.getElementById('root') || document.getElementById('main'));
root.render(<App />);