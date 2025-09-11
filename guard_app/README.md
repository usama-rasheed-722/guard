# Guard Platform - Flutter App

A comprehensive Flutter application for the Guard Platform - a security guard hiring platform that connects agencies with qualified guards for temporary jobs and permanent shifts.

## Features

### 🎨 Centralized Theme System
- **Single Source of Truth**: All colors, typography, and button styles are defined in one place
- **Easy Customization**: Change the entire app's appearance by modifying theme files
- **Consistent Design**: Reusable components ensure uniform UI across the app
- **Material Design 3**: Modern, accessible design following Material Design guidelines

### 🔧 Reusable Components
- **AppButton**: Multiple button types (Primary, Secondary, Outline, Text, Icon)
- **AppTextField**: Comprehensive input fields with validation
- **AppCard**: Various card layouts for different content types
- **AppLoading**: Loading states and shimmer effects
- **Form Components**: Pre-built form fields for common inputs

### 🏗️ Architecture
- **Clean Architecture**: Well-organized folder structure
- **Service Layer**: API services for all backend communication
- **Model Layer**: Type-safe data models
- **View Layer**: Screen-based organization
- **Widget Layer**: Reusable UI components

### 📱 Core Functionality
- **Authentication**: Login, registration, and profile management
- **Role-based Access**: Different interfaces for Admin, Agency, and Guard users
- **Dashboard**: Personalized dashboard with role-specific features
- **Navigation**: Bottom navigation with role-based screens
- **State Management**: Efficient state handling with proper loading states

## Project Structure

```
lib/
├── core/
│   ├── theme/                 # Centralized theme system
│   │   ├── app_colors.dart    # Color definitions
│   │   ├── app_text_styles.dart # Typography styles
│   │   └── app_theme.dart     # Main theme configuration
│   ├── constants/             # App constants and strings
│   │   ├── app_constants.dart # API endpoints, status values
│   │   └── app_strings.dart   # UI text strings
│   ├── services/              # API service layer
│   │   ├── api_service.dart   # Base API service
│   │   └── auth_service.dart  # Authentication service
│   └── utils/                 # Utility functions
├── models/                    # Data models
│   ├── user_model.dart        # User and profile models
│   ├── auth_response_model.dart # Authentication response
│   └── job_model.dart         # Job and application models
├── views/                     # Screen implementations
│   ├── auth/                  # Authentication screens
│   ├── dashboard/             # Dashboard and main screens
│   ├── jobs/                  # Job management screens
│   ├── shifts/                # Shift management screens
│   ├── attendance/            # Attendance tracking screens
│   ├── wallet/                # Wallet and payment screens
│   └── profile/               # Profile management screens
├── widgets/                   # Reusable UI components
│   ├── common/                # Common widgets
│   │   ├── app_button.dart    # Button components
│   │   ├── app_card.dart      # Card components
│   │   └── app_loading.dart   # Loading components
│   └── forms/                 # Form components
│       └── app_text_field.dart # Input field components
└── main.dart                  # App entry point
```

## Getting Started

### Prerequisites
- Flutter SDK (3.0 or higher)
- Dart SDK (3.0 or higher)
- Android Studio / VS Code
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd guard_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API endpoint**
   - Update `baseUrl` in `lib/core/constants/app_constants.dart`
   - Ensure backend API is running

4. **Run the app**
   ```bash
   flutter run
   ```

## Theme Customization

### Changing Colors
To change the app's color scheme, modify `lib/core/theme/app_colors.dart`:

```dart
class AppColors {
  // Primary Colors
  static const Color primary = Color(0xFF2E7D32); // Change this
  static const Color primaryLight = Color(0xFF4CAF50);
  static const Color primaryDark = Color(0xFF1B5E20);
  
  // Add your custom colors here
}
```

### Changing Typography
To modify text styles, update `lib/core/theme/app_text_styles.dart`:

```dart
class AppTextStyles {
  static const TextStyle displayLarge = TextStyle(
    fontSize: 32, // Change this
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  // Modify other styles as needed
}
```

### Changing Button Styles
Button styles are automatically applied through the theme. To customize:

1. Modify button styles in `app_theme.dart`
2. Use `AppButton` widget with custom parameters
3. Create new button variants in `app_button.dart`

## Component Usage

### Buttons
```dart
// Primary button
AppPrimaryButton(
  text: 'Submit',
  onPressed: () {},
  isFullWidth: true,
)

// Outline button
AppOutlineButton(
  text: 'Cancel',
  onPressed: () {},
)

// Icon button
AppIconButton(
  icon: Icons.add,
  onPressed: () {},
)
```

### Text Fields
```dart
// Basic text field
AppTextField(
  label: 'Name',
  hint: 'Enter your name',
  isRequired: true,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    return null;
  },
)

// Email field
AppEmailField(
  controller: emailController,
  label: 'Email',
  isRequired: true,
)

// Password field
AppPasswordField(
  controller: passwordController,
  label: 'Password',
  isRequired: true,
)
```

### Cards
```dart
// Basic card
AppCard(
  child: Text('Card content'),
)

// Info card
AppInfoCard(
  title: 'Total Jobs',
  value: '25',
  icon: Icons.work,
  iconColor: AppColors.primary,
)

// Status card
AppStatusCard(
  title: 'Job Status',
  status: 'Active',
  statusColor: AppColors.success,
  icon: Icons.check_circle,
)
```

## API Integration

### Authentication
```dart
final authService = AuthService();

// Login
final response = await authService.login(
  email: 'user@example.com',
  password: 'password',
);

// Register
final response = await authService.register(
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password',
  role: 'guard',
);
```

### API Service
```dart
final apiService = ApiService();

// GET request
final response = await apiService.get('/jobs');

// POST request
final response = await apiService.post('/jobs', data: {
  'title': 'Security Job',
  'description': 'Night shift security',
});

// File upload
final response = await apiService.uploadFile(
  '/upload',
  file,
  fieldName: 'photo',
);
```

## State Management

The app uses a simple state management approach:

1. **Local State**: For UI-specific state using `setState()`
2. **Service Layer**: For API calls and data persistence
3. **Shared Preferences**: For storing user tokens and settings

## Navigation

### Screen Navigation
```dart
// Navigate to screen
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => const NextScreen(),
  ),
);

// Replace current screen
Navigator.of(context).pushReplacement(
  MaterialPageRoute(
    builder: (context) => const NextScreen(),
  ),
);
```

### Bottom Navigation
The app uses bottom navigation for main screens:
- Dashboard
- Jobs
- Shifts
- Attendance
- Wallet

## Error Handling

### API Errors
```dart
try {
  final response = await apiService.get('/endpoint');
  // Handle success
} catch (e) {
  // Handle error
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(e.toString()),
      backgroundColor: AppColors.error,
    ),
  );
}
```

### Form Validation
```dart
final _formKey = GlobalKey<FormState>();

// Validate form
if (_formKey.currentState!.validate()) {
  // Form is valid
} else {
  // Form has errors
}
```

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

## Building for Production

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## Dependencies

### Core Dependencies
- `http`: HTTP client for API calls
- `dio`: Advanced HTTP client with interceptors
- `shared_preferences`: Local storage
- `image_picker`: Camera and gallery access
- `geolocator`: Location services
- `permission_handler`: Permission management
- `cached_network_image`: Image caching
- `flutter_svg`: SVG support
- `intl`: Internationalization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Complete job management screens
- [ ] Implement shift management
- [ ] Add attendance tracking with camera
- [ ] Integrate wallet and payment features
- [ ] Add push notifications
- [ ] Implement offline support
- [ ] Add dark theme support
- [ ] Internationalization (i18n)
- [ ] Unit and integration tests
- [ ] Performance optimization