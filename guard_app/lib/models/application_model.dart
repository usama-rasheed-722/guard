import 'user_model.dart';
import 'shift_model.dart';

class Application {
  final String id;
  final String guardId;
  final String? jobId;
  final String? shiftId;
  final String status; // applied, accepted, rejected, completed
  final double? bidRate;
  final String? coverLetter;
  final DateTime appliedAt;
  final DateTime? respondedAt;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final User? guard;
  // Avoid circular import with job_model.dart; only keep jobId
  final Shift? shift;

  const Application({
    required this.id,
    required this.guardId,
    this.jobId,
    this.shiftId,
    required this.status,
    this.bidRate,
    this.coverLetter,
    required this.appliedAt,
    this.respondedAt,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.guard,
    this.shift,
  });

  factory Application.fromJson(Map<String, dynamic> json) {
    return Application(
      id: json['id'],
      guardId: json['guard_id'],
      jobId: json['job_id'],
      shiftId: json['shift_id'],
      status: json['status'],
      bidRate: json['bid_rate']?.toDouble(),
      coverLetter: json['cover_letter'],
      appliedAt: DateTime.parse(json['applied_at']),
      respondedAt: json['responded_at'] != null
          ? DateTime.parse(json['responded_at'])
          : null,
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      guard: json['guard'] != null ? User.fromJson(json['guard']) : null,
      shift: json['shift'] != null ? Shift.fromJson(json['shift']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'guard_id': guardId,
      'job_id': jobId,
      'shift_id': shiftId,
      'status': status,
      'bid_rate': bidRate,
      'cover_letter': coverLetter,
      'applied_at': appliedAt.toIso8601String(),
      'responded_at': respondedAt?.toIso8601String(),
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'guard': guard?.toJson(),
      'shift': shift?.toJson(),
    };
  }

  Application copyWith({
    String? id,
    String? guardId,
    String? jobId,
    String? shiftId,
    String? status,
    double? bidRate,
    String? coverLetter,
    DateTime? appliedAt,
    DateTime? respondedAt,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
    User? guard,
    Shift? shift,
  }) {
    return Application(
      id: id ?? this.id,
      guardId: guardId ?? this.guardId,
      jobId: jobId ?? this.jobId,
      shiftId: shiftId ?? this.shiftId,
      status: status ?? this.status,
      bidRate: bidRate ?? this.bidRate,
      coverLetter: coverLetter ?? this.coverLetter,
      appliedAt: appliedAt ?? this.appliedAt,
      respondedAt: respondedAt ?? this.respondedAt,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      guard: guard ?? this.guard,
      shift: shift ?? this.shift,
    );
  }

  bool get isApplied => status == 'applied';
  bool get isAccepted => status == 'accepted';
  bool get isRejected => status == 'rejected';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
  bool get isForJob => jobId != null;
  bool get isForShift => shiftId != null;
}

