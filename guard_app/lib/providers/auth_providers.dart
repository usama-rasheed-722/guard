import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/auth_state.dart';
import '../models/user_model.dart';
import 'api_providers.dart';
import '../core/services/auth_service.dart';

// Auth State Notifier
class AuthNotifier extends Notifier<AuthState> {
  AuthService get _authService => ref.read(authServiceProvider);

  @override
  AuthState build() => const AuthState();

  Future<void> initialize() async {
    state = state.copyWith(isLoading: true);
    try {
      final isAuth = await _authService.isAuthenticated();
      if (isAuth) {
        final user = await _authService.getProfile();
        final token = await _authService.getToken();
        state = state.copyWith(
          isAuthenticated: true,
          user: user,
          token: token,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          isAuthenticated: false,
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
        isAuthenticated: false,
      );
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _authService.login(
        email: email,
        password: password,
      );
      
      if (response.success && response.user != null) {
        state = state.copyWith(
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          isLoading: false,
          error: null,
        );
      } else {
        state = state.copyWith(
          error: response.message,
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

  Future<void> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String role = 'guard',
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _authService.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: role,
      );
      
      if (response.success && response.user != null) {
        state = state.copyWith(
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          isLoading: false,
          error: null,
        );
      } else {
        state = state.copyWith(
          error: response.message,
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

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    try {
      await _authService.logout();
      state = const AuthState();
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  Future<void> updateProfile({
    String? name,
    String? phone,
  }) async {
    if (state.user == null) return;
    
    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedUser = await _authService.updateProfile(
        name: name,
        phone: phone,
      );
      state = state.copyWith(
        user: updatedUser,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Auth State Provider
final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

// User Provider
final userProvider = Provider<User?>((ref) {
  final authState = ref.watch(authProvider);
  return authState.user;
});

// Is Authenticated Provider
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authProvider);
  return authState.isAuthenticated;
});

// Auth Loading Provider
final authLoadingProvider = Provider<bool>((ref) {
  final authState = ref.watch(authProvider);
  return authState.isLoading;
});

// Auth Error Provider
final authErrorProvider = Provider<String?>((ref) {
  final authState = ref.watch(authProvider);
  return authState.error;
});