class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:3000/api';
  static const String apiVersion = 'v1';
  static const int connectionTimeout = 30000;
  static const int receiveTimeout = 30000;
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  
  // User Roles
  static const String roleAdmin = 'admin';
  static const String roleAgency = 'agency';
  static const String roleGuard = 'guard';
  
  // Job Status
  static const String jobStatusOpen = 'open';
  static const String jobStatusHiring = 'hiring';
  static const String jobStatusHired = 'hired';
  static const String jobStatusInProgress = 'in_progress';
  static const String jobStatusCompleted = 'completed';
  static const String jobStatusCancelled = 'cancelled';
  
  // Shift Status
  static const String shiftStatusOpen = 'open';
  static const String shiftStatusAssigned = 'assigned';
  static const String shiftStatusActive = 'active';
  static const String shiftStatusTerminated = 'terminated';
  static const String shiftStatusResigned = 'resigned';
  static const String shiftStatusCompleted = 'completed';
  
  // Application Status
  static const String applicationStatusApplied = 'applied';
  static const String applicationStatusAccepted = 'accepted';
  static const String applicationStatusRejected = 'rejected';
  static const String applicationStatusCompleted = 'completed';
  static const String applicationStatusCancelled = 'cancelled';
  
  // Attendance Status
  static const String attendanceStatusPending = 'pending';
  static const String attendanceStatusCheckedIn = 'checked_in';
  static const String attendanceStatusCheckedOut = 'checked_out';
  static const String attendanceStatusNoShow = 'no_show';
  static const String attendanceStatusLate = 'late';
  
  // Transaction Types
  static const String transactionTypeDeposit = 'deposit';
  static const String transactionTypeEscrow = 'escrow';
  static const String transactionTypeRelease = 'release';
  static const String transactionTypeWithdrawal = 'withdrawal';
  static const String transactionTypeRefund = 'refund';
  static const String transactionTypeFee = 'fee';
  
  // Transaction Status
  static const String transactionStatusPending = 'pending';
  static const String transactionStatusSuccess = 'success';
  static const String transactionStatusFailed = 'failed';
  static const String transactionStatusHold = 'hold';
  static const String transactionStatusCancelled = 'cancelled';
  
  // User Status
  static const String userStatusActive = 'active';
  static const String userStatusSuspended = 'suspended';
  static const String userStatusPending = 'pending';
  
  // Verification Status
  static const String verificationStatusPending = 'pending';
  static const String verificationStatusVerified = 'verified';
  static const String verificationStatusRejected = 'rejected';
  
  // Pagination
  static const int defaultPageSize = 10;
  static const int maxPageSize = 100;
  
  // File Upload
  static const int maxFileSize = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocumentTypes = ['pdf', 'doc', 'docx'];
  
  // Location
  static const double defaultLocationAccuracy = 10.0; // meters
  static const int locationTimeout = 10; // seconds
  
  // Escrow
  static const int escrowHoldDays = 5;
  
  // App Information
  static const String appName = 'Guard Platform';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'Security Guard Hiring Platform';
  
  // Error Messages
  static const String networkError = 'Network connection error';
  static const String serverError = 'Server error occurred';
  static const String unknownError = 'Unknown error occurred';
  static const String validationError = 'Validation error';
  static const String authenticationError = 'Authentication failed';
  static const String authorizationError = 'Access denied';
  
  // Success Messages
  static const String loginSuccess = 'Login successful';
  static const String registerSuccess = 'Registration successful';
  static const String profileUpdateSuccess = 'Profile updated successfully';
  static const String passwordChangeSuccess = 'Password changed successfully';
  static const String jobCreateSuccess = 'Job created successfully';
  static const String shiftCreateSuccess = 'Shift created successfully';
  static const String applicationSubmitSuccess = 'Application submitted successfully';
  static const String checkInSuccess = 'Checked in successfully';
  static const String checkOutSuccess = 'Checked out successfully';
  static const String paymentSuccess = 'Payment processed successfully';
  
  // Validation Messages
  static const String requiredField = 'This field is required';
  static const String invalidEmail = 'Please enter a valid email address';
  static const String invalidPhone = 'Please enter a valid phone number';
  static const String passwordTooShort = 'Password must be at least 6 characters';
  static const String passwordMismatch = 'Passwords do not match';
  static const String invalidAmount = 'Please enter a valid amount';
  static const String insufficientBalance = 'Insufficient balance';
  
  // Days of Week
  static const List<String> daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  
  // Time Formats
  static const String timeFormat12 = 'h:mm a';
  static const String timeFormat24 = 'HH:mm';
  static const String dateFormat = 'yyyy-MM-dd';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'MMM dd, yyyy';
  static const String displayDateTimeFormat = 'MMM dd, yyyy h:mm a';
}