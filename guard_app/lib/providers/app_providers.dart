import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/app_state.dart';

// App State Notifier
class AppNotifier extends Notifier<AppState> {
  @override
  AppState build() => const AppState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setInitialized(bool isInitialized) {
    state = state.copyWith(isInitialized: isInitialized);
  }

  void setBottomNavIndex(int index) {
    state = state.copyWith(currentBottomNavIndex: index);
  }

  void toggleTheme() {
    state = state.copyWith(isDarkMode: !state.isDarkMode);
  }
}

// App State Provider
final appProvider = NotifierProvider<AppNotifier, AppState>(AppNotifier.new);

// Loading State Notifier
class LoadingNotifier extends Notifier<LoadingState> {
  @override
  LoadingState build() => const LoadingState();

  void showLoading([String? message]) {
    state = LoadingState(isLoading: true, message: message);
  }

  void hideLoading() {
    state = const LoadingState(isLoading: false);
  }
}

// Loading State Provider
final loadingProvider = NotifierProvider<LoadingNotifier, LoadingState>(LoadingNotifier.new);

// Bottom Navigation Index Provider
final bottomNavIndexProvider = Provider<int>((ref) {
  final appState = ref.watch(appProvider);
  return appState.currentBottomNavIndex;
});

// Theme Mode Provider
final themeModeProvider = Provider<bool>((ref) {
  final appState = ref.watch(appProvider);
  return appState.isDarkMode;
});