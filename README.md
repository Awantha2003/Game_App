# Game App - Educational Platform

A React Native Expo application with user authentication and role-based access control for an educational gaming platform.

## Features

### 🔐 Authentication & User Management
- **Secure Login/Registration**: Email and password authentication
- **Role-Based Access**: Student, Teacher, and Admin roles
- **Secure Storage**: JWT tokens stored using Expo SecureStore
- **Profile Management**: Users can update their profile information

### 👥 User Roles

#### Student
- Play games without registration (optional local profile)
- View game results and progress
- Access student dashboard

#### Teacher
- Full authentication required
- Manage questions and levels
- View student results
- Update profile information

#### Admin
- Complete system management
- User management (approve/disable teacher accounts)
- System analytics and settings
- Question and level management

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (AuthContext)
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── services/           # API and storage services
│   ├── authService.ts
│   └── secureStorage.ts
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Awantha2003/Game_App.git
cd Game_App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Expo SecureStore**: Secure storage for sensitive data
- **Context API**: State management for authentication

## Authentication Flow

1. **Login**: Teachers and admins log in with email/password
2. **Registration**: New teachers can register (requires admin approval)
3. **Student Access**: Students can play without registration
4. **Role-Based Navigation**: Different dashboards based on user role
5. **Secure Storage**: JWT tokens stored securely using Expo SecureStore

## API Integration

The app is designed to work with a Node.js backend with MongoDB. Currently using mock data for development. To integrate with a real backend:

1. Update `API_BASE_URL` in `src/services/authService.ts`
2. Uncomment the real API calls in the service methods
3. Implement the backend endpoints

## Security Features

- **JWT Token Storage**: Secure token storage using Expo SecureStore
- **Role-Based Access Control**: Different access levels for different user types
- **Input Validation**: Form validation for all user inputs
- **Secure Logout**: Complete data cleanup on logout

## Development Status

✅ **Completed (Part 1)**:
- User authentication system
- Role-based access control
- Secure storage implementation
- Profile management
- Navigation structure

🚧 **Next Phase**:
- Game functionality
- Question management
- Student progress tracking
- Admin analytics
- Backend API integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Contact

- **Email**: awanthaimesh65@gmail.com
- **GitHub**: [@Awantha2003](https://github.com/Awantha2003)

## License

This project is licensed under the MIT License.
