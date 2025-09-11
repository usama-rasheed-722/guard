import 'package:freezed_annotation/freezed_annotation.dart';

part 'app_state.freezed.dart';

@freezed
class AppState with _$AppState {
  const factory AppState({
    @Default(false) bool isLoading,
    @Default(false) bool isInitialized,
    String? error,
    @Default(0) int currentBottomNavIndex,
    @Default(false) bool isDarkMode,
  }) = _AppState;
}

@freezed
class LoadingState with _$LoadingState {
  const factory LoadingState({
    @Default(false) bool isLoading,
    String? message,
  }) = _LoadingState;
}