import 'package:freezed_annotation/freezed_annotation.dart';
import '../models/user_model.dart';

part 'auth_state.freezed.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    @Default(false) bool isLoading,
    @Default(false) bool isAuthenticated,
    User? user,
    String? error,
    String? token,
  }) = _AuthState;
}

@freezed
class LoginState with _$LoginState {
  const factory LoginState({
    @Default(false) bool isLoading,
    @Default(false) bool isSuccess,
    String? error,
    User? user,
  }) = _LoginState;
}

@freezed
class RegisterState with _$RegisterState {
  const factory RegisterState({
    @Default(false) bool isLoading,
    @Default(false) bool isSuccess,
    String? error,
    User? user,
  }) = _RegisterState;
}