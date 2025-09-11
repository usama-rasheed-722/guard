class Attendance {
  final String id;
  final String guardId;
  final String? jobId;
  final String? shiftId;
  final DateTime? checkInTime;
  final DateTime? checkOutTime;
  final String? photoUrl;
  final double? latitude;
  final double? longitude;
  final String status; // pending, checked_in, checked_out
  final DateTime createdAt;
  final DateTime updatedAt;

  const Attendance({
    required this.id,
    required this.guardId,
    this.jobId,
    this.shiftId,
    this.checkInTime,
    this.checkOutTime,
    this.photoUrl,
    this.latitude,
    this.longitude,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'],
      guardId: json['guard_id'],
      jobId: json['job_id'],
      shiftId: json['shift_id'],
      checkInTime: json['check_in_time'] != null
          ? DateTime.parse(json['check_in_time'])
          : null,
      checkOutTime: json['check_out_time'] != null
          ? DateTime.parse(json['check_out_time'])
          : null,
      photoUrl: json['photo_url'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'guard_id': guardId,
      'job_id': jobId,
      'shift_id': shiftId,
      'check_in_time': checkInTime?.toIso8601String(),
      'check_out_time': checkOutTime?.toIso8601String(),
      'photo_url': photoUrl,
      'latitude': latitude,
      'longitude': longitude,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  Attendance copyWith({
    String? id,
    String? guardId,
    String? jobId,
    String? shiftId,
    DateTime? checkInTime,
    DateTime? checkOutTime,
    String? photoUrl,
    double? latitude,
    double? longitude,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Attendance(
      id: id ?? this.id,
      guardId: guardId ?? this.guardId,
      jobId: jobId ?? this.jobId,
      shiftId: shiftId ?? this.shiftId,
      checkInTime: checkInTime ?? this.checkInTime,
      checkOutTime: checkOutTime ?? this.checkOutTime,
      photoUrl: photoUrl ?? this.photoUrl,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  bool get isCheckedIn => status == 'checked_in';
  bool get isCheckedOut => status == 'checked_out';
  bool get isPending => status == 'pending';
}

