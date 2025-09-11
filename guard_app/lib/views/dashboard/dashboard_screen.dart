import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../widgets/common/app_card.dart';
import '../../models/user_model.dart';
import '../../providers/app_providers.dart';
import '../jobs/jobs_screen.dart';
import '../shifts/shifts_screen.dart';
import '../attendance/attendance_screen.dart';
import '../wallet/wallet_screen.dart';
import '../profile/profile_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  final User user;

  const DashboardScreen({super.key, required this.user});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {

  @override
  Widget build(BuildContext context) {
    final currentIndex = ref.watch(bottomNavIndexProvider);
    final appNotifier = ref.read(appProvider.notifier);

    return Scaffold(
      body: _buildBody(currentIndex),
      bottomNavigationBar: _buildBottomNavigationBar(currentIndex, appNotifier),
    );
  }

  Widget _buildBody(int currentIndex) {
    switch (currentIndex) {
      case 0:
        return _buildDashboard();
      case 1:
        return const JobsScreen();
      case 2:
        return const ShiftsScreen();
      case 3:
        return const AttendanceScreen();
      case 4:
        return const WalletScreen();
      default:
        return _buildDashboard();
    }
  }

  Widget _buildDashboard() {
    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${widget.user.name}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => ProfileScreen(user: widget.user),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            AppCard(
              backgroundColor: AppColors.primary.withOpacity(0.1),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          _getRoleIcon(),
                          color: AppColors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back!',
                              style: AppTextStyles.titleLarge.copyWith(
                                color: AppColors.primary,
                              ),
                            ),
                            Text(
                              'You are logged in as ${widget.user.role}',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Quick Actions
            Text(
              'Quick Actions',
              style: AppTextStyles.headlineSmall,
            ),
            
            const SizedBox(height: 16),
            
            _buildQuickActions(),
            
            const SizedBox(height: 24),
            
            // Statistics
            Text(
              'Statistics',
              style: AppTextStyles.headlineSmall,
            ),
            
            const SizedBox(height: 16),
            
            _buildStatistics(),
            
            const SizedBox(height: 24),
            
            // Recent Activity
            Text(
              'Recent Activity',
              style: AppTextStyles.headlineSmall,
            ),
            
            const SizedBox(height: 16),
            
            _buildRecentActivity(),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    final actions = _getQuickActions();
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.5,
      ),
      itemCount: actions.length,
      itemBuilder: (context, index) {
        final action = actions[index];
        return AppCard(
          onTap: action['onTap'],
          isClickable: true,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                action['icon'],
                color: action['color'],
                size: 32,
              ),
              const SizedBox(height: 8),
              Text(
                action['title'],
                style: AppTextStyles.titleMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatistics() {
    final stats = _getStatistics();
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) {
        final stat = stats[index];
        return AppInfoCard(
          title: stat['title'],
          value: stat['value'],
          icon: stat['icon'],
          iconColor: stat['color'],
        );
      },
    );
  }

  Widget _buildRecentActivity() {
    return AppCard(
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.work, color: AppColors.primary),
            title: const Text('New job posted'),
            subtitle: const Text('Security guard needed at Mall'),
            trailing: const Text('2 hours ago'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.check_circle, color: AppColors.success),
            title: const Text('Application accepted'),
            subtitle: const Text('Your application for Night Shift'),
            trailing: const Text('1 day ago'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.payment, color: AppColors.info),
            title: const Text('Payment received'),
            subtitle: const Text('\$150.00 for completed job'),
            trailing: const Text('3 days ago'),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar(int currentIndex, AppNotifier appNotifier) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (index) {
        appNotifier.setBottomNavIndex(index);
      },
      type: BottomNavigationBarType.fixed,
      items: [
        const BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        const BottomNavigationBarItem(
          icon: Icon(Icons.work),
          label: 'Jobs',
        ),
        const BottomNavigationBarItem(
          icon: Icon(Icons.schedule),
          label: 'Shifts',
        ),
        const BottomNavigationBarItem(
          icon: Icon(Icons.access_time),
          label: 'Attendance',
        ),
        const BottomNavigationBarItem(
          icon: Icon(Icons.account_balance_wallet),
          label: 'Wallet',
        ),
      ],
    );
  }

  IconData _getRoleIcon() {
    switch (widget.user.role) {
      case 'admin':
        return Icons.admin_panel_settings;
      case 'agency':
        return Icons.business;
      case 'guard':
        return Icons.security;
      default:
        return Icons.person;
    }
  }

  List<Map<String, dynamic>> _getQuickActions() {
    switch (widget.user.role) {
      case 'agency':
        return [
          {
            'title': 'Post Job',
            'icon': Icons.work,
            'color': AppColors.primary,
            'onTap': () {
              // TODO: Navigate to create job
            },
          },
          {
            'title': 'Create Shift',
            'icon': Icons.schedule,
            'color': AppColors.secondary,
            'onTap': () {
              // TODO: Navigate to create shift
            },
          },
          {
            'title': 'View Applications',
            'icon': Icons.assignment,
            'color': AppColors.accent,
            'onTap': () {
              // TODO: Navigate to applications
            },
          },
          {
            'title': 'Manage Guards',
            'icon': Icons.people,
            'color': AppColors.info,
            'onTap': () {
              // TODO: Navigate to guards management
            },
          },
        ];
      case 'guard':
        return [
          {
            'title': 'Find Jobs',
            'icon': Icons.search,
            'color': AppColors.primary,
            'onTap': () {
              ref.read(appProvider.notifier).setBottomNavIndex(1);
            },
          },
          {
            'title': 'My Shifts',
            'icon': Icons.schedule,
            'color': AppColors.secondary,
            'onTap': () {
              ref.read(appProvider.notifier).setBottomNavIndex(2);
            },
          },
          {
            'title': 'Check In/Out',
            'icon': Icons.access_time,
            'color': AppColors.accent,
            'onTap': () {
              ref.read(appProvider.notifier).setBottomNavIndex(3);
            },
          },
          {
            'title': 'My Wallet',
            'icon': Icons.account_balance_wallet,
            'color': AppColors.info,
            'onTap': () {
              ref.read(appProvider.notifier).setBottomNavIndex(4);
            },
          },
        ];
      default:
        return [];
    }
  }

  List<Map<String, dynamic>> _getStatistics() {
    switch (widget.user.role) {
      case 'agency':
        return [
          {
            'title': 'Active Jobs',
            'value': '12',
            'icon': Icons.work,
            'color': AppColors.primary,
          },
          {
            'title': 'Hired Guards',
            'value': '45',
            'icon': Icons.people,
            'color': AppColors.success,
          },
          {
            'title': 'Pending Applications',
            'value': '8',
            'icon': Icons.pending,
            'color': AppColors.warning,
          },
          {
            'title': 'Total Spent',
            'value': '\$2,450',
            'icon': Icons.payment,
            'color': AppColors.info,
          },
        ];
      case 'guard':
        return [
          {
            'title': 'Completed Jobs',
            'value': '25',
            'icon': Icons.check_circle,
            'color': AppColors.success,
          },
          {
            'title': 'Active Shifts',
            'value': '3',
            'icon': Icons.schedule,
            'color': AppColors.primary,
          },
          {
            'title': 'Total Earnings',
            'value': '\$1,850',
            'icon': Icons.account_balance_wallet,
            'color': AppColors.info,
          },
          {
            'title': 'Rating',
            'value': '4.8',
            'icon': Icons.star,
            'color': AppColors.accent,
          },
        ];
      default:
        return [];
    }
  }
}