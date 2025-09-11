import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/feedback_model.dart';

class FeedbackState {
  final bool isLoading;
  final List<FeedbackModel> feedbacksGiven;
  final List<FeedbackModel> feedbacksReceived;
  final String? error;

  const FeedbackState({
    this.isLoading = false,
    this.feedbacksGiven = const [],
    this.feedbacksReceived = const [],
    this.error,
  });

  FeedbackState copyWith({
    bool? isLoading,
    List<FeedbackModel>? feedbacksGiven,
    List<FeedbackModel>? feedbacksReceived,
    String? error,
  }) {
    return FeedbackState(
      isLoading: isLoading ?? this.isLoading,
      feedbacksGiven: feedbacksGiven ?? this.feedbacksGiven,
      feedbacksReceived: feedbacksReceived ?? this.feedbacksReceived,
      error: error,
    );
  }
}

class FeedbackNotifier extends Notifier<FeedbackState> {
  @override
  FeedbackState build() => const FeedbackState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setFeedbacksGiven(List<FeedbackModel> feedbacks) {
    state = state.copyWith(feedbacksGiven: feedbacks);
  }

  void setFeedbacksReceived(List<FeedbackModel> feedbacks) {
    state = state.copyWith(feedbacksReceived: feedbacks);
  }

  void addFeedbackGiven(FeedbackModel feedback) {
    state = state.copyWith(feedbacksGiven: [feedback, ...state.feedbacksGiven]);
  }

  void addFeedbackReceived(FeedbackModel feedback) {
    state = state.copyWith(feedbacksReceived: [feedback, ...state.feedbacksReceived]);
  }
}

final feedbackProvider = NotifierProvider<FeedbackNotifier, FeedbackState>(FeedbackNotifier.new);

final feedbacksGivenProvider = Provider<List<FeedbackModel>>((ref) {
  return ref.watch(feedbackProvider).feedbacksGiven;
});

final feedbacksReceivedProvider = Provider<List<FeedbackModel>>((ref) {
  return ref.watch(feedbackProvider).feedbacksReceived;
});

final feedbackLoadingProvider = Provider<bool>((ref) {
  return ref.watch(feedbackProvider).isLoading;
});

final feedbackErrorProvider = Provider<String?>((ref) {
  return ref.watch(feedbackProvider).error;
});

