# 📅 CrewShift - Smart Shift Calendar

A modern web application for visualizing and managing work shift patterns for rotating shift teams. Built with Angular and Firebase, CrewShift helps workers track their work schedules and manage vacation days in an intuitive, visual calendar interface.

![Angular](https://img.shields.io/badge/Angular-20.3.3-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

CrewShift is designed for workers in rotating shift environments such as manufacturing plants, security services, healthcare facilities, and 24/7 operations. The application automatically calculates and displays your work schedule based on a rotating shift pattern, while allowing you to customize individual days for vacation planning, overtime tracking, and personal modifications.

**Perfect for teams working in rotating shifts who need to:**
- Track when they're scheduled to work (early shift, late shift, or days off)
- Plan and visualize vacation days throughout the year
- Keep track of overtime and schedule changes
- View public holidays alongside their work schedule
- Synchronize their schedule across multiple devices

### Key Features

- 🔄 **Automatic Shift Pattern Calculation**: 9-day rotating cycle (3 days early shift, 3 days late shift, 3 days off)
- 👥 **Multi-Crew Support**: Manage different teams with staggered start dates
- 🎨 **Intuitive Color-Coded Visualization**: Easy to distinguish between shift types and days off
- ✏️ **Customizable Schedule**: Click any day to modify it - mark vacation days, overtime, or adjust your schedule
- 🏖️ **Annual Leave Tracking**: Automatically tracks your vacation days (31-day annual limit)
- 📊 **Analytics Dashboard**: View statistics about days off, shift balance, and vacation usage
- 🌍 **Holiday Integration**: Built-in support for Irish public holidays (easily extendable to other regions)
- 🔐 **User Authentication**: Secure Google Sign-In with Firebase
- ☁️ **Cloud Sync**: Your schedule and modifications are synchronized across all your devices
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Technology Stack

- **Frontend Framework**: Angular 20.3.3 (Standalone Components with Signals)
- **UI Library**: PrimeNG 20.2.0 with custom Material Design theme
- **Backend/Database**: Firebase (Authentication & Firestore)
- **Language**: TypeScript 5.9.2
- **State Management**: Angular Signals (reactive state)
- **Styling**: SCSS with responsive design patterns
- **Build Tool**: Angular CLI with esbuild
- **Deployment**: Server-side rendering (SSR) support with Angular Universal

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- A Firebase account (free tier is sufficient)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

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

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use an existing one)
   - Enable **Authentication**:
     - Go to Authentication > Sign-in method
     - Enable **Google** as a sign-in provider
   - Create a **Firestore Database**:
     - Go to Firestore Database
     - Click "Create database"
     - Start in **production mode**
   - Get your Firebase configuration:
     - Go to Project Settings > General
     - Scroll to "Your apps" section
     - Click the web icon (</>) to add a web app
     - Copy the Firebase configuration object

4. **Set up environment files**

   ```bash
   # Copy the example environment file
   copy src\environments\environment.example.ts src\environments\environment.ts
   copy src\environments\environment.example.ts src\environments\environment.prod.ts
   ```

   Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your Firebase configuration:

   ```typescript
   export const environment = {
     production: false, // Set to true in environment.prod.ts
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

   In your Firebase console, go to Firestore Database > Rules and set:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // User-specific data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Analytics data (read/write for authenticated users)
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

   The application will open automatically at `http://localhost:4200/`

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory and can be deployed to any static hosting service (Firebase Hosting, Netlify, Vercel, etc.).

## 📖 How to Use

### First Time Setup

1. **Sign In**
   - Open the application in your browser
   - Click "Sign in with Google" button
   - Authorize the application with your Google account

2. **Select Your Crew**
   - After signing in, you'll be prompted to select your crew/team
   - Choose from available crews: David, Trevor, or Paddy
   - Each crew has a different start date for their shift rotation

3. **View Your Calendar**
   - Your work schedule will be automatically generated and displayed
   - The calendar shows the entire year with color-coded days

### Understanding the Calendar

The calendar uses an intuitive color-coding system to help you quickly identify your schedule:

| Color | Shift Type | Description |
|-------|-----------|-------------|
| 🟡 **Yellow** | Early Shift | Your scheduled early shift days |
| 🟠 **Orange** | Late Shift | Your scheduled late shift days |
| 🟢 **Green** | Days Off | Your regular days off according to the shift pattern |
| 🟣 **Purple** | Annual Leave | Days you've marked as vacation/annual leave |
| 🔴 **Red Dot** | Public Holiday | National holidays (appears as a small indicator) |

### Modifying Your Schedule

#### Marking Vacation Days

1. **Click on any day** in the calendar
2. A **Day Type Selector** modal will appear
3. Select **"Annual Leave"** from the options
4. The day will turn purple and count toward your annual vacation balance
5. Your changes are automatically saved to the cloud

> **Note:** The application tracks your annual leave and enforces a maximum of 31 vacation days per year.

#### Changing Day Types (Overtime/Schedule Adjustments)

Need to work on a day off? Took time off during a work day? You can easily adjust:

1. **Click on the day** you want to modify
2. In the Day Type Selector, choose the appropriate type:
   - **Early Shift** - If you're working an early shift instead of your scheduled type
   - **Late Shift** - If you're working a late shift
   - **Days Off** - If you have a day off instead of a work day
   - **Annual Leave** - If you're taking vacation time

3. The calendar will update immediately
4. Modified days show a small indicator to remind you they've been changed from the original schedule

#### Resetting Days

If you need to undo a modification:

1. Click on the modified day
2. In the modal, you'll see the option to **"Reset to original"**
3. Click the reset button to restore the day to its automatic shift pattern

Alternatively, you can:
- **Reset individual days** through the day type selector
- **Clear all modifications** for the entire year using the settings menu

### Navigation Features

#### Month Navigation
- Use the **left/right arrows** in the calendar header to move between months
- Click **"Today"** button to instantly jump to the current date
- Use the **month/year selector** to jump to any specific month

#### Calendar Settings

Access settings by clicking the ⚙️ **gear icon**:

- **Switch Crews**: Change your crew assignment
- **Week Start Day**: Choose whether weeks start on Sunday or Monday
- **Show Shift Labels**: Toggle the text labels on calendar days
- **View Analytics**: See detailed statistics about your schedule
- **Sign Out**: Log out of your account

### Analytics & Statistics

View your schedule statistics through the analytics section:

- **Total Days Off**: Count of your scheduled and vacation days off
- **Shift Distribution**: Breakdown of early shifts, late shifts, and days off
- **Annual Leave Used**: How many vacation days you've taken
- **Annual Leave Remaining**: How many vacation days you have left (out of 31)
- **Monthly Breakdown**: See patterns and distributions by month

### Tips for Effective Use

1. **Plan Ahead**: Use the calendar to visualize your year and plan vacations around your shift pattern
2. **Check Public Holidays**: Red dots indicate public holidays - perfect for planning long weekends
3. **Track Modifications**: Keep an eye on modified days to ensure your schedule stays accurate
4. **Regular Sync**: Your data syncs automatically, but make sure you're connected to the internet for changes to save
5. **Multiple Devices**: Access your calendar from phone, tablet, or computer - it's always in sync

### Common Use Cases

#### Planning a Vacation
1. Browse future months to find when you have natural days off
2. Click on work days you want to take as vacation
3. Select "Annual Leave" to mark them
4. Check your remaining annual leave balance

#### Recording Overtime
1. Find a day that was originally a day off
2. Click on it and change it to "Early Shift" or "Late Shift"
3. The system tracks that you worked on a scheduled day off

#### Adjusting for Schedule Changes
1. If your actual shift differs from the pattern
2. Simply click the day and change it to the correct type
3. The modification is saved and synced across all devices

## 🏛️ Project Structure

```
crew-shift/
├── src/
│   ├── app/
│   │   ├── core/                       # Core application modules
│   │   │   ├── constants/             # Application-wide constants
│   │   │   │   └── app.constants.ts   # Shift patterns, calendar config, holidays
│   │   │   ├── models/                # TypeScript interfaces and enums
│   │   │   │   ├── shift.models.ts    # Shift types, crew configs
│   │   │   │   ├── user-settings.models.ts
│   │   │   │   └── analytics.models.ts
│   │   │   ├── services/              # Business logic services
│   │   │   │   ├── auth.service.ts    # Google authentication
│   │   │   │   ├── shift.service.ts   # Shift calculations and modifications
│   │   │   │   ├── firestore.service.ts # Database operations
│   │   │   │   ├── user-settings.service.ts
│   │   │   │   └── analytics.service.ts
│   │   │   └── interceptors/          # HTTP interceptors
│   │   │       └── error.interceptor.ts
│   │   ├── pages/                      # Page components (routes)
│   │   │   └── calendar-view/         # Main calendar page
│   │   │       ├── calendar-view.ts   # Component logic
│   │   │       ├── calendar-view.html # Template
│   │   │       └── calendar-view.scss # Styles
│   │   └── shared/                     # Reusable components
│   │       └── components/
│   │           ├── auth-login/        # Login component
│   │           ├── calendar-day/      # Individual day cell
│   │           ├── calendar-header/   # Navigation header
│   │           ├── calendar-legend/   # Color legend
│   │           ├── crew-info/         # Crew information display
│   │           ├── crew-selection-modal/
│   │           ├── day-type-selector/ # Modal for changing day types
│   │           └── settings-modal/    # Settings dialog
│   ├── environments/                   # Environment configurations
│   │   ├── environment.ts             # Development config
│   │   ├── environment.prod.ts        # Production config
│   │   └── environment.example.ts     # Template for configuration
│   ├── styles.scss                     # Global styles
│   └── index.html                      # Main HTML file
├── public/                             # Static assets
├── angular.json                        # Angular workspace configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # npm dependencies and scripts
└── README.md                           # This file
```

### Key Components Explained

- **calendar-view**: The main page that displays the entire calendar grid
- **calendar-day**: Individual day cells with color coding and click handlers
- **day-type-selector**: Modal dialog for changing day types (vacation, overtime, etc.)
- **crew-selection-modal**: Initial crew selection on first use
- **shift.service.ts**: Core logic for calculating shift patterns and handling modifications
- **firestore.service.ts**: All database interactions and data synchronization

## 🔒 Security & Privacy

### Firebase Security

The Firebase API key visible in the environment files is **intentionally public** for client-side applications. Firebase security is enforced through:

1. **Firestore Security Rules**: Only authenticated users can access their own data
2. **Domain Restrictions**: Configure authorized domains in Firebase Console (Authentication > Settings)
3. **Authentication**: All data operations require a valid, authenticated user session

### Data Privacy

- **User Isolation**: Each user's data is stored in a separate Firestore document
- **No Data Sharing**: Users cannot access other users' schedules or modifications
- **Local Fallback**: The app uses local storage as a backup when offline
- **Secure Authentication**: Google Sign-In provides industry-standard OAuth 2.0 authentication
- **No Tracking**: The app doesn't use analytics that track personal information

### Recommended Security Practices

For production deployment:

1. **Enable App Check** in Firebase Console for additional bot protection
2. **Configure authorized domains** to prevent unauthorized access
3. **Set up Firebase App Check** to verify requests come from your app
4. **Review Firestore rules** regularly to ensure data protection
5. **Keep dependencies updated** for security patches

## 🤝 Contributing

Contributions are welcome! Whether you want to fix bugs, add features, or improve documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/crew-shift.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make your changes**
   - Follow the existing code style and conventions
   - Add tests if applicable
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing new feature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-new-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Describe your changes clearly

### Development Guidelines

- Follow Angular and TypeScript best practices (see `copilot-instructions.md`)
- Use standalone components (no NgModules)
- Implement signals for state management
- Write clean, commented code
- Test your changes thoroughly
- Keep commits atomic and well-described

### Ideas for Contributions

- 🌍 Add support for holidays in different countries
- 📊 Enhance analytics with charts and visualizations
- 🔔 Implement notification system for upcoming shifts
- � Add Progressive Web App (PWA) capabilities
- 🎨 Create additional themes
- 🌐 Add internationalization (i18n) support
- ⚡ Performance optimizations

## �📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

You are free to:
- ✅ Use this software commercially
- ✅ Modify the source code
- ✅ Distribute copies
- ✅ Use it privately

Under the condition that:
- � You include the original license and copyright notice

## �🙏 Acknowledgments

This project is built with amazing open-source technologies:

- **[Angular](https://angular.dev/)** - Modern web framework by Google
- **[PrimeNG](https://primeng.org/)** - Rich UI component library
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service platform by Google
- **[PrimeIcons](https://primeng.org/icons)** - Icon library
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript

Special thanks to all the open-source contributors who make projects like this possible!

## 📧 Support & Contact

### Need Help?

- 📖 Check the [Usage Guide](#how-to-use) for detailed instructions
- 🐛 Found a bug? [Open an issue](https://github.com/YOUR_USERNAME/crew-shift/issues)
- 💡 Have a feature request? [Start a discussion](https://github.com/YOUR_USERNAME/crew-shift/discussions)
- ❓ Questions? Check existing issues or create a new one

### Stay Updated

- ⭐ Star this repository to show your support
- 👀 Watch the repository to get notified of updates
- 🔄 Follow the project for new releases

---

## 📋 Frequently Asked Questions

**Q: Can I customize the shift pattern?**  
A: Yes! Edit the `CREW_CONFIGS` in `src/app/core/constants/app.constants.ts` to adjust the shift cycle, pattern, and crew configurations.

**Q: How do I add holidays for my country?**  
A: Modify the `IRISH_PUBLIC_HOLIDAYS` constant in `app.constants.ts` to include holidays relevant to your region.

**Q: Does this work offline?**  
A: The app uses local storage as a fallback, so you can view your calendar offline. However, modifications require an internet connection to sync with Firebase.

**Q: Can I use this for different shift patterns?**  
A: Absolutely! The application is designed to be flexible. You can modify the shift cycle length and pattern in the configuration files.

**Q: Is my data safe?**  
A: Yes. All data is secured with Firebase Authentication and Firestore security rules. Only you can access your schedule and modifications.

**Q: Can multiple people from the same crew use this?**  
A: Yes! Each user has their own account and can track their personal modifications separately.

---

**Note**: This application was specifically designed for rotating shift patterns common in industrial and service environments. The default configuration uses a 9-day cycle with 3-day early shifts, 3-day late shifts, and 3 days off, but it can be customized to match your specific work schedule.

**Made with ❤️ for shift workers everywhere**
