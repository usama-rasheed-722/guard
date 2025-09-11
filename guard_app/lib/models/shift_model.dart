import 'user_model.dart';

class Shift {
  final String id;
  final String companyId;
  final String? guardId;
  final String locationName;
  final double latitude;
  final double longitude;
  final String startTime; // HH:mm or ISO time string from backend
  final String endTime;   // HH:mm or ISO time string from backend
  final List<String> daysOfWeek; // ["Mon","Tue",...]
  final int extraHours; // default 0
  final String status; // active, terminated, resigned
  final DateTime createdAt;
  final DateTime updatedAt;
  final User? company;
  final User? guard;

  const Shift({
    required this.id,
    required this.companyId,
    this.guardId,
    required this.locationName,
    required this.latitude,
    required this.longitude,
    required this.startTime,
    required this.endTime,
    required this.daysOfWeek,
    this.extraHours = 0,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.company,
    this.guard,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'],
      companyId: json['company_id'],
      guardId: json['guard_id'],
      locationName: json['location_name'],
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      startTime: json['start_time'],
      endTime: json['end_time'],
      daysOfWeek: (json['days_of_week'] as List?)?.map((e) => e.toString()).toList() ?? <String>[],
      extraHours: json['extra_hours'] ?? 0,
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      company: json['company'] != null ? User.fromJson(json['company']) : null,
      guard: json['guard'] != null ? User.fromJson(json['guard']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_id': companyId,
      'guard_id': guardId,
      'location_name': locationName,
      'latitude': latitude,
      'longitude': longitude,
      'start_time': startTime,
      'end_time': endTime,
      'days_of_week': daysOfWeek,
      'extra_hours': extraHours,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'company': company?.toJson(),
      'guard': guard?.toJson(),
    };
  }

  Shift copyWith({
    String? id,
    String? companyId,
    String? guardId,
    String? locationName,
    double? latitude,
    double? longitude,
    String? startTime,
    String? endTime,
    List<String>? daysOfWeek,
    int? extraHours,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    User? company,
    User? guard,
  }) {
    return Shift(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      guardId: guardId ?? this.guardId,
      locationName: locationName ?? this.locationName,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      daysOfWeek: daysOfWeek ?? this.daysOfWeek,
      extraHours: extraHours ?? this.extraHours,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      company: company ?? this.company,
      guard: guard ?? this.guard,
    );
  }

  bool get isActive => status == 'active';
  bool get isTerminated => status == 'terminated';
  bool get isResigned => status == 'resigned';
}

