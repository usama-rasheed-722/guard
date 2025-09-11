import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/job_model.dart';
import '../models/application_model.dart';

// Job State
class JobState {
  final bool isLoading;
  final List<Job> jobs;
  final List<Job> myJobs;
  final List<Application> applications;
  final String? error;
  final Job? selectedJob;

  const JobState({
    this.isLoading = false,
    this.jobs = const [],
    this.myJobs = const [],
    this.applications = const [],
    this.error,
    this.selectedJob,
  });

  JobState copyWith({
    bool? isLoading,
    List<Job>? jobs,
    List<Job>? myJobs,
    List<Application>? applications,
    String? error,
    Job? selectedJob,
  }) {
    return JobState(
      isLoading: isLoading ?? this.isLoading,
      jobs: jobs ?? this.jobs,
      myJobs: myJobs ?? this.myJobs,
      applications: applications ?? this.applications,
      error: error,
      selectedJob: selectedJob ?? this.selectedJob,
    );
  }
}


// Job Notifier (Riverpod v3 Notifier API)
class JobNotifier extends Notifier<JobState> {
  @override
  JobState build() => const JobState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setJobs(List<Job> jobs) {
    state = state.copyWith(jobs: jobs);
  }

  void setMyJobs(List<Job> myJobs) {
    state = state.copyWith(myJobs: myJobs);
  }

  void setApplications(List<Application> applications) {
    state = state.copyWith(applications: applications);
  }

  void setSelectedJob(Job? job) {
    state = state.copyWith(selectedJob: job);
  }

  void addJob(Job job) {
    state = state.copyWith(jobs: [...state.jobs, job]);
  }

  void updateJob(Job updatedJob) {
    final jobs = state.jobs.map((job) {
      return job.id == updatedJob.id ? updatedJob : job;
    }).toList();
    state = state.copyWith(jobs: jobs);
  }

  void removeJob(String jobId) {
    final jobs = state.jobs.where((job) => job.id != jobId).toList();
    state = state.copyWith(jobs: jobs);
  }
}

// Job Providers
final jobProvider = NotifierProvider<JobNotifier, JobState>(JobNotifier.new);

final jobsProvider = Provider<List<Job>>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.jobs;
});

final myJobsProvider = Provider<List<Job>>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.myJobs;
});

final applicationsProvider = Provider<List<Application>>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.applications;
});

final selectedJobProvider = Provider<Job?>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.selectedJob;
});

final jobLoadingProvider = Provider<bool>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.isLoading;
});

final jobErrorProvider = Provider<String?>((ref) {
  final jobState = ref.watch(jobProvider);
  return jobState.error;
});