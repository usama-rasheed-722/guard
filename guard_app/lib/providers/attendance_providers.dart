import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/attendance_model.dart';

// Attendance State
class AttendanceState {
  final bool isLoading;
  final List<Attendance> attendances;
  final Attendance? currentAttendance;
  final String? error;
  final bool isCheckingIn;
  final bool isCheckingOut;

  const AttendanceState({
    this.isLoading = false,
    this.attendances = const [],
    this.currentAttendance,
    this.error,
    this.isCheckingIn = false,
    this.isCheckingOut = false,
  });

  AttendanceState copyWith({
    bool? isLoading,
    List<Attendance>? attendances,
    Attendance? currentAttendance,
    String? error,
    bool? isCheckingIn,
    bool? isCheckingOut,
  }) {
    return AttendanceState(
      isLoading: isLoading ?? this.isLoading,
      attendances: attendances ?? this.attendances,
      currentAttendance: currentAttendance ?? this.currentAttendance,
      error: error,
      isCheckingIn: isCheckingIn ?? this.isCheckingIn,
      isCheckingOut: isCheckingOut ?? this.isCheckingOut,
    );
  }
}

// Attendance Notifier
class AttendanceNotifier extends Notifier<AttendanceState> {
  @override
  AttendanceState build() => const AttendanceState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setAttendances(List<Attendance> attendances) {
    state = state.copyWith(attendances: attendances);
  }

  void setCurrentAttendance(Attendance? attendance) {
    state = state.copyWith(currentAttendance: attendance);
  }

  void setCheckingIn(bool isCheckingIn) {
    state = state.copyWith(isCheckingIn: isCheckingIn);
  }

  void setCheckingOut(bool isCheckingOut) {
    state = state.copyWith(isCheckingOut: isCheckingOut);
  }

  void addAttendance(Attendance attendance) {
    state = state.copyWith(attendances: [...state.attendances, attendance]);
  }

  void updateAttendance(Attendance updatedAttendance) {
    final attendances = state.attendances.map((attendance) {
      return attendance.id == updatedAttendance.id ? updatedAttendance : attendance;
    }).toList();
    state = state.copyWith(attendances: attendances);
  }

  Future<void> checkIn({
    required String jobId,
    required String shiftId,
    required String photoUrl,
    required double latitude,
    required double longitude,
  }) async {
    state = state.copyWith(isCheckingIn: true, error: null);
    try {
      // TODO: Implement check-in API call
      // final attendance = await attendanceService.checkIn(...);
      // state = state.copyWith(
      //   currentAttendance: attendance,
      //   isCheckingIn: false,
      // );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isCheckingIn: false,
      );
    }
  }

  Future<void> checkOut({
    required String attendanceId,
    required String photoUrl,
    required double latitude,
    required double longitude,
  }) async {
    state = state.copyWith(isCheckingOut: true, error: null);
    try {
      // TODO: Implement check-out API call
      // final attendance = await attendanceService.checkOut(...);
      // state = state.copyWith(
      //   currentAttendance: null,
      //   isCheckingOut: false,
      // );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isCheckingOut: false,
      );
    }
  }
}

// Attendance Providers
final attendanceProvider = NotifierProvider<AttendanceNotifier, AttendanceState>(AttendanceNotifier.new);

final attendancesProvider = Provider<List<Attendance>>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.attendances;
});

final currentAttendanceProvider = Provider<Attendance?>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.currentAttendance;
});

final attendanceLoadingProvider = Provider<bool>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.isLoading;
});

final attendanceErrorProvider = Provider<String?>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.error;
});

final isCheckingInProvider = Provider<bool>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.isCheckingIn;
});

final isCheckingOutProvider = Provider<bool>((ref) {
  final attendanceState = ref.watch(attendanceProvider);
  return attendanceState.isCheckingOut;
});

// Forward declaration for Attendance model
// model now imported from ../models/attendance_model.dart