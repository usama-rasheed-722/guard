import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/shift_model.dart';

// Shift State
class ShiftState {
  final bool isLoading;
  final List<Shift> shifts;
  final List<Shift> myShifts;
  final String? error;
  final Shift? selectedShift;

  const ShiftState({
    this.isLoading = false,
    this.shifts = const [],
    this.myShifts = const [],
    this.error,
    this.selectedShift,
  });

  ShiftState copyWith({
    bool? isLoading,
    List<Shift>? shifts,
    List<Shift>? myShifts,
    String? error,
    Shift? selectedShift,
  }) {
    return ShiftState(
      isLoading: isLoading ?? this.isLoading,
      shifts: shifts ?? this.shifts,
      myShifts: myShifts ?? this.myShifts,
      error: error,
      selectedShift: selectedShift ?? this.selectedShift,
    );
  }
}

// Shift Notifier
class ShiftNotifier extends Notifier<ShiftState> {
  @override
  ShiftState build() => const ShiftState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setShifts(List<Shift> shifts) {
    state = state.copyWith(shifts: shifts);
  }

  void setMyShifts(List<Shift> myShifts) {
    state = state.copyWith(myShifts: myShifts);
  }

  void setSelectedShift(Shift? shift) {
    state = state.copyWith(selectedShift: shift);
  }

  void addShift(Shift shift) {
    state = state.copyWith(shifts: [...state.shifts, shift]);
  }

  void updateShift(Shift updatedShift) {
    final shifts = state.shifts.map((shift) {
      return shift.id == updatedShift.id ? updatedShift : shift;
    }).toList();
    state = state.copyWith(shifts: shifts);
  }

  void removeShift(String shiftId) {
    final shifts = state.shifts.where((shift) => shift.id != shiftId).toList();
    state = state.copyWith(shifts: shifts);
  }
}

// Shift Providers
final shiftProvider = NotifierProvider<ShiftNotifier, ShiftState>(ShiftNotifier.new);

final shiftsProvider = Provider<List<Shift>>((ref) {
  final shiftState = ref.watch(shiftProvider);
  return shiftState.shifts;
});

final myShiftsProvider = Provider<List<Shift>>((ref) {
  final shiftState = ref.watch(shiftProvider);
  return shiftState.myShifts;
});

final selectedShiftProvider = Provider<Shift?>((ref) {
  final shiftState = ref.watch(shiftProvider);
  return shiftState.selectedShift;
});

final shiftLoadingProvider = Provider<bool>((ref) {
  final shiftState = ref.watch(shiftProvider);
  return shiftState.isLoading;
});

final shiftErrorProvider = Provider<String?>((ref) {
  final shiftState = ref.watch(shiftProvider);
  return shiftState.error;
});