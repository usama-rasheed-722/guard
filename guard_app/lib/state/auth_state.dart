import '../models/user_model.dart';

class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final User? user;
  final String? error;
  final String? token;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
    this.token,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    User? user,
    String? error,
    String? token,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: error,
      token: token ?? this.token,
    );
  }
}

class LoginState {
  final bool isLoading;
  final bool isSuccess;
  final String? error;
  final User? user;

  const LoginState({
    this.isLoading = false,
    this.isSuccess = false,
    this.error,
    this.user,
  });
}

class RegisterState {
  final bool isLoading;
  final bool isSuccess;
  final String? error;
  final User? user;

  const RegisterState({
    this.isLoading = false,
    this.isSuccess = false,
    this.error,
    this.user,
  });
}