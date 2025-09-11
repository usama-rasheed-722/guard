# Riverpod 2 Integration Guide

This document explains how Riverpod 2 has been integrated into the Guard Platform Flutter app, replacing all Flutter state management with a comprehensive Riverpod-based architecture.

## 🏗️ Architecture Overview

### State Management Structure
```
lib/
├── state/                    # State classes using Freezed
│   ├── auth_state.dart      # Authentication state
│   └── app_state.dart       # App-wide state
├── providers/               # Riverpod providers
│   ├── api_providers.dart   # API service providers
│   ├── auth_providers.dart  # Authentication providers
│   ├── app_providers.dart   # App state providers
│   ├── job_providers.dart   # Job management providers
│   ├── shift_providers.dart # Shift management providers
│   ├── attendance_providers.dart # Attendance providers
│   └── wallet_providers.dart # Wallet providers
└── views/                   # UI screens using ConsumerWidget
```

## 🔧 Key Features

### 1. **Immutable State with Freezed**
- All state classes use Freezed for immutability
- Automatic `copyWith` methods
- Built-in equality and toString methods
- JSON serialization support

### 2. **Type-Safe Providers**
- Strongly typed providers with proper error handling
- Automatic dependency injection
- Provider composition and dependency management

### 3. **Reactive UI**
- All screens use `ConsumerWidget` or `ConsumerStatefulWidget`
- Automatic UI updates when state changes
- Efficient rebuilds with granular provider watching

### 4. **Centralized State Management**
- Single source of truth for all app state
- Predictable state updates through notifiers
- Easy testing and debugging

## 📱 Provider Categories

### Authentication Providers
```dart
// Main auth state
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>

// Derived providers
final userProvider = Provider<User?>
final isAuthenticatedProvider = Provider<bool>
final authLoadingProvider = Provider<bool>
final authErrorProvider = Provider<String?>
```

### App State Providers
```dart
// App-wide state
final appProvider = StateNotifierProvider<AppNotifier, AppState>

// Navigation state
final bottomNavIndexProvider = Provider<int>
final themeModeProvider = Provider<bool>

// Loading state
final loadingProvider = StateNotifierProvider<LoadingNotifier, LoadingState>
```

### Feature-Specific Providers
```dart
// Jobs
final jobProvider = StateNotifierProvider<JobNotifier, JobState>
final jobsProvider = Provider<List<Job>>
final myJobsProvider = Provider<List<Job>>

// Shifts
final shiftProvider = StateNotifierProvider<ShiftNotifier, ShiftState>
final shiftsProvider = Provider<List<Shift>>

// Attendance
final attendanceProvider = StateNotifierProvider<AttendanceNotifier, AttendanceState>
final isCheckingInProvider = Provider<bool>

// Wallet
final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>
final balanceProvider = Provider<double>
final transactionsProvider = Provider<List<Transaction>>
```

## 🎯 Usage Examples

### 1. **Watching State in UI**
```dart
class MyScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    final isLoading = ref.watch(authLoadingProvider);
    
    if (isLoading) {
      return CircularProgressIndicator();
    }
    
    return Text('Welcome ${user?.name}');
  }
}
```

### 2. **Reading State for Actions**
```dart
class MyButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ElevatedButton(
      onPressed: () {
        ref.read(authProvider.notifier).logout();
      },
      child: Text('Logout'),
    );
  }
}
```

### 3. **Listening to State Changes**
```dart
class MyScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Listen to auth state changes
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next.error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.error!)),
        );
        ref.read(authProvider.notifier).clearError();
      }
    });
    
    return Container();
  }
}
```

### 4. **State Notifier Implementation**
```dart
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._authService) : super(const AuthState());

  final AuthService _authService;

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _authService.login(email, password);
      if (response.success) {
        state = state.copyWith(
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }
}
```

## 🔄 State Flow

### Authentication Flow
1. **Initialization**: App checks for stored token
2. **Login**: User credentials → API call → State update
3. **Success**: User data stored, navigation to dashboard
4. **Error**: Error message displayed, state reset

### Navigation Flow
1. **Bottom Navigation**: Index stored in app state
2. **Screen Changes**: Provider updates trigger UI rebuilds
3. **Deep Linking**: State can be restored from any screen

### Data Flow
1. **API Calls**: Through service providers
2. **State Updates**: Via notifier methods
3. **UI Updates**: Automatic through provider watching
4. **Error Handling**: Centralized error state management

## 🧪 Testing

### Provider Testing
```dart
void main() {
  group('AuthNotifier', () {
    test('should update state when login succeeds', () async {
      final container = ProviderContainer();
      final notifier = container.read(authProvider.notifier);
      
      await notifier.login('test@example.com', 'password');
      
      final state = container.read(authProvider);
      expect(state.isAuthenticated, true);
      expect(state.user?.email, 'test@example.com');
    });
  });
}
```

### Widget Testing
```dart
void main() {
  testWidgets('should show loading indicator when authenticating', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );
    
    // Trigger login
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();
    
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
```

## 🚀 Benefits of Riverpod Integration

### 1. **Performance**
- Granular rebuilds (only affected widgets rebuild)
- Automatic provider caching
- Efficient state updates

### 2. **Developer Experience**
- Strong typing throughout
- Excellent IDE support
- Easy debugging with provider inspector
- Hot reload compatibility

### 3. **Maintainability**
- Clear separation of concerns
- Predictable state management
- Easy to test and mock
- Scalable architecture

### 4. **Reliability**
- Compile-time safety
- Automatic dependency injection
- Error boundary handling
- State consistency guarantees

## 📋 Migration Checklist

- ✅ Added Riverpod dependencies
- ✅ Created state classes with Freezed
- ✅ Implemented providers for all features
- ✅ Updated main.dart with ProviderScope
- ✅ Converted all screens to ConsumerWidget
- ✅ Replaced setState with provider updates
- ✅ Implemented error handling
- ✅ Added loading states
- ✅ Created derived providers
- ✅ Updated navigation logic

## 🔧 Configuration

### Dependencies
```yaml
dependencies:
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0
  freezed_annotation: ^3.1.0
  json_annotation: ^4.9.0

dev_dependencies:
  build_runner: ^2.7.1
  freezed: ^3.2.3
  json_serializable: ^6.11.1
  riverpod_generator: ^3.0.0
```

### Build Runner
```bash
# Generate code
flutter packages pub run build_runner build

# Watch for changes
flutter packages pub run build_runner watch
```

## 🎉 Result

The Guard Platform now uses Riverpod 2 for all state management, providing:

- **Zero Flutter State**: No more `setState()` calls
- **Type Safety**: Compile-time guarantees
- **Performance**: Optimized rebuilds
- **Maintainability**: Clean, testable code
- **Scalability**: Easy to add new features
- **Developer Experience**: Excellent tooling support

The app is now ready for production with a robust, scalable state management solution! 🚀