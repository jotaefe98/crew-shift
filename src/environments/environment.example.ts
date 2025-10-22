/**
 * Environment configuration template
 *
 * Copy this file to:
 * - environment.ts (for development)
 * - environment.prod.ts (for production)
 *
 * Then replace the placeholder values with your actual Firebase configuration
 */
export const environment = {
  production: false, // Set to true for production
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
  },
};
