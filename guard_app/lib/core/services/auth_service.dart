import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../constants/app_constants.dart';
import '../../models/user_model.dart';
import '../../models/auth_response_model.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  // Register new user
  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String role = 'guard',
  }) async {
    final response = await _apiService.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone,
      'role': role,
    });

    final data = _apiService.parseResponse(response);
    final authResponse = AuthResponse.fromJson(data);
    
    if (authResponse.token != null) {
      await _apiService.setToken(authResponse.token!);
    }
    
    return authResponse;
  }

  // Login user
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiService.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    final data = _apiService.parseResponse(response);
    final authResponse = AuthResponse.fromJson(data);
    
    if (authResponse.token != null) {
      await _apiService.setToken(authResponse.token!);
    }
    
    return authResponse;
  }

  // Get current user profile
  Future<User> getProfile() async {
    final response = await _apiService.get('/auth/profile');
    final data = _apiService.parseResponse(response);
    return User.fromJson(data['user']);
  }

  // Update user profile
  Future<User> updateProfile({
    String? name,
    String? phone,
  }) async {
    final response = await _apiService.put('/auth/profile', data: {
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
    });

    final data = _apiService.parseResponse(response);
    return User.fromJson(data['user']);
  }

  // Change password
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    await _apiService.put('/auth/change-password', data: {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }

  // Logout
  Future<void> logout() async {
    try {
      await _apiService.post('/auth/logout');
    } finally {
      await _clearToken();
    }
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.tokenKey);
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    return await _apiService.hasToken();
  }

  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConstants.tokenKey);
  }
}