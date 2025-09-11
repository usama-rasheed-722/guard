import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_strings.dart';
import '../../providers/job_providers.dart';

class JobsScreen extends ConsumerWidget {
  const JobsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobs = ref.watch(jobsProvider);
    final isLoading = ref.watch(jobLoadingProvider);
    final error = ref.watch(jobErrorProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.jobs),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // TODO: Navigate to create job
            },
          ),
        ],
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
              : jobs.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.work,
                            size: 64,
                            color: AppColors.primary,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No Jobs Available',
                            style: AppTextStyles.headlineMedium,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'No jobs have been posted yet',
                            style: AppTextStyles.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: jobs.length,
                      itemBuilder: (context, index) {
                        final job = jobs[index];
                        return Card(
                          margin: const EdgeInsets.all(8),
                          child: ListTile(
                            title: Text(job.title),
                            subtitle: Text(job.description ?? ''),
                            trailing: Text('\$${job.hourlyRate.toStringAsFixed(2)}/hr'),
                            onTap: () {
                              // TODO: Navigate to job details
                            },
                          ),
                        );
                      },
                    ),
    );
  }
}