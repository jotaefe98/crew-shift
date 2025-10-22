# 📅 CrewShift - Smart Shift Calendar

A modern web application for visualizing and managing work shift patterns for rotating shift teams. Built with Angular and Firebase, CrewShift helps workers plan and track their days off, vacations, and work schedules in an intuitive, visual way.

![Angular](https://img.shields.io/badge/Angular-20.3.3-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

CrewShift is designed for workers in rotating shift environments (manufacturing, security, healthcare, 24/7 services). It provides a visual calendar that automatically calculates shift patterns based on a repeating cycle, while allowing individual customization for vacations and special days.

### Key Features

- 🔄 **Automatic Shift Pattern Calculation**: 9-day rotating cycle (3 days early shift, 3 days late shift, 3 days off)
- 👥 **Multi-Crew Support**: Manage different teams with staggered start dates
- 🎨 **Intuitive Color-Coded Visualization**: Easy to distinguish between shift types and days off
- ✏️ **Customizable Schedule**: Manually override specific days for vacations or special events
- 📊 **Analytics Dashboard**: Track days off, shift balance, and vacation usage
- 🌍 **Holiday Integration**: Built-in support for Irish public holidays (easily extendable)
- 🔐 **User Authentication**: Secure Google Sign-In with Firebase
- ☁️ **Cloud Sync**: Data synchronized across devices via Firestore
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Technology Stack

- **Frontend Framework**: Angular 20.3.3 (Standalone Components)
- **UI Library**: PrimeNG with custom Material Design theme
- **Backend**: Firebase (Authentication & Firestore)
- **Language**: TypeScript 5.9.2
- **State Management**: Angular Signals
- **Styling**: SCSS with responsive design
- **Build Tool**: Angular CLI with esbuild

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase project (see setup instructions below)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/crew-shift.git
   cd crew-shift
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google Sign-In provider
   - Create a Firestore database in production mode
   - Copy the Firebase configuration from your project settings

4. **Set up environment files**

   ```bash
   # Copy the example environment file
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

   Then edit both files and replace the placeholder values with your Firebase configuration:

   ```typescript
   export const environment = {
     production: false, // true for environment.prod.ts
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
   ```

5. **Configure Firestore Security Rules**

   In your Firebase console, set the following Firestore security rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /analytics/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

6. **Run the development server**

   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📖 Usage

### First Time Setup

1. Open the application and sign in with your Google account
2. Select your crew from the available options
3. The calendar will automatically display your shift pattern

### Managing Your Schedule

- **View Shifts**: The calendar color codes your shifts:

  - 🟡 Yellow: Early shift
  - 🟠 Orange: Late shift
  - 🟢 Green: Days off
  - 🟣 Purple: Annual leave
  - 🔴 Red dot: Public holidays

- **Modify Days**: Click on any day to change its type
- **Plan Vacations**: Mark days as annual leave (31-day limit per year)
- **Reset Changes**: Clear individual days or all modifications
- **View Statistics**: Check your time off balance and shift distribution

### Settings

Access settings via the gear icon to:

- Switch between different crews
- Toggle week start (Sunday/Monday)
- Sign out
- View analytics

## 🏛️ Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services and models
│   │   ├── constants/          # App-wide constants
│   │   ├── models/             # TypeScript interfaces
│   │   ├── services/           # Business logic services
│   │   └── interceptors/       # HTTP interceptors
│   ├── pages/                   # Page components
│   │   └── calendar-view/      # Main calendar page
│   ├── shared/                  # Reusable components
│   │   └── components/         # Shared UI components
│   └── environments/            # Environment configurations
```

## 🔒 Security Considerations

### Firebase API Keys

The Firebase API key in the environment files is **intentionally public** for frontend applications. However, you must:

1. **Configure domain restrictions** in Firebase Console under "Authentication > Settings > Authorized domains"
2. **Set up Firestore security rules** to protect user data (see setup instructions above)
3. **Enable App Check** for additional security (recommended for production)

### Data Privacy

- All user data is stored per-user in Firestore with strict security rules
- Only authenticated users can access their own data
- Local storage is used as a fallback for offline functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Angular](https://angular.dev/)
- UI components from [PrimeNG](https://primeng.org/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Icons from [PrimeIcons](https://primeng.org/icons)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This application was specifically designed for rotating shift patterns common in industrial and service environments. The shift cycle and crew configurations can be customized in the constants files to match your specific needs.
