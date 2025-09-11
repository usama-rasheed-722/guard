class AppState {
  final bool isLoading;
  final bool isInitialized;
  final String? error;
  final int currentBottomNavIndex;
  final bool isDarkMode;

  const AppState({
    this.isLoading = false,
    this.isInitialized = false,
    this.error,
    this.currentBottomNavIndex = 0,
    this.isDarkMode = false,
  });

  AppState copyWith({
    bool? isLoading,
    bool? isInitialized,
    String? error,
    int? currentBottomNavIndex,
    bool? isDarkMode,
  }) {
    return AppState(
      isLoading: isLoading ?? this.isLoading,
      isInitialized: isInitialized ?? this.isInitialized,
      error: error,
      currentBottomNavIndex: currentBottomNavIndex ?? this.currentBottomNavIndex,
      isDarkMode: isDarkMode ?? this.isDarkMode,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppState &&
        other.isLoading == isLoading &&
        other.isInitialized == isInitialized &&
        other.error == error &&
        other.currentBottomNavIndex == currentBottomNavIndex &&
        other.isDarkMode == isDarkMode;
  }

  @override
  int get hashCode => Object.hash(
        isLoading,
        isInitialized,
        error,
        currentBottomNavIndex,
        isDarkMode,
      );
}

class LoadingState {
  final bool isLoading;
  final String? message;

  const LoadingState({
    this.isLoading = false,
    this.message,
  });

  LoadingState copyWith({
    bool? isLoading,
    String? message,
  }) {
    return LoadingState(
      isLoading: isLoading ?? this.isLoading,
      message: message ?? this.message,
    );
  }
}