import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_strings.dart';
import '../../models/user_model.dart';
import '../../providers/auth_providers.dart';

class ProfileScreen extends ConsumerWidget {
  final User user;

  const ProfileScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(userProvider) ?? user;
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.profile),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Navigate to edit profile
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Header
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: AppColors.primary,
                      child: Text(
                        currentUser.name.isNotEmpty ? currentUser.name[0].toUpperCase() : 'U',
                        style: AppTextStyles.headlineMedium.copyWith(
                          color: AppColors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      currentUser.name,
                      style: AppTextStyles.headlineSmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      currentUser.email,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getRoleColor(currentUser).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        currentUser.role.toUpperCase(),
                        style: AppTextStyles.labelSmall.copyWith(
                          color: _getRoleColor(currentUser),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Profile Information
            Text(
              'Profile Information',
              style: AppTextStyles.headlineSmall,
            ),
            
            const SizedBox(height: 16),
            
            _buildInfoCard('Name', currentUser.name),
            _buildInfoCard('Email', currentUser.email),
            if (currentUser.phone != null) _buildInfoCard('Phone', currentUser.phone!),
            _buildInfoCard('Role', currentUser.role),
            _buildInfoCard('Status', currentUser.status),
            _buildInfoCard('Email Verified', currentUser.emailVerified ? 'Yes' : 'No'),
            _buildInfoCard('Phone Verified', currentUser.phoneVerified ? 'Yes' : 'No'),
            if (currentUser.lastLogin != null) 
              _buildInfoCard('Last Login', _formatDate(currentUser.lastLogin!)),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(String label, String value) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        title: Text(
          label,
          style: AppTextStyles.labelMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        subtitle: Text(
          value,
          style: AppTextStyles.bodyMedium,
        ),
      ),
    );
  }

  Color _getRoleColor(User user) {
    switch (user.role) {
      case 'admin':
        return AppColors.adminColor;
      case 'agency':
        return AppColors.agencyColor;
      case 'guard':
        return AppColors.guardColor;
      default:
        return AppColors.primary;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}