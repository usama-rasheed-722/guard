import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_strings.dart';
import '../../providers/attendance_providers.dart';

class AttendanceScreen extends ConsumerWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final attendances = ref.watch(attendancesProvider);
    final isLoading = ref.watch(attendanceLoadingProvider);
    final error = ref.watch(attendanceErrorProvider);
    final isCheckingIn = ref.watch(isCheckingInProvider);
    final isCheckingOut = ref.watch(isCheckingOutProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.attendance),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: AppColors.error,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Error',
                        style: AppTextStyles.headlineMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        error,
                        style: AppTextStyles.bodyMedium,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // Check In/Out Buttons
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: isCheckingIn ? null : () {
                                // TODO: Implement check-in
                              },
                              icon: isCheckingIn
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.login),
                              label: Text(isCheckingIn ? 'Checking In...' : 'Check In'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: isCheckingOut ? null : () {
                                // TODO: Implement check-out
                              },
                              icon: isCheckingOut
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.logout),
                              label: Text(isCheckingOut ? 'Checking Out...' : 'Check Out'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Attendance History
                    Expanded(
                      child: attendances.isEmpty
                          ? const Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.access_time,
                                    size: 64,
                                    color: AppColors.primary,
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    'No Attendance Records',
                                    style: AppTextStyles.headlineMedium,
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Your attendance history will appear here',
                                    style: AppTextStyles.bodyMedium,
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              itemCount: attendances.length,
                              itemBuilder: (context, index) {
                                final attendance = attendances[index];
                                return Card(
                                  margin: const EdgeInsets.all(8),
                                  child: ListTile(
                                    title: Text('Attendance ${attendance.id}'),
                                    subtitle: Text(attendance.status),
                                    trailing: Text(
                                      attendance.checkInTime != null
                                          ? 'Checked In'
                                          : 'Pending',
                                    ),
                                    onTap: () {
                                      // TODO: Navigate to attendance details
                                    },
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }
}