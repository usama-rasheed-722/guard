class JobLocation {
  final String id;
  final String jobId;
  final String locationName;
  final String? address;
  final double latitude;
  final double longitude;
  final double hoursRequired;
  final String? startTime;
  final String? endTime;
  final int requiredGuards;
  final String? specialRequirements;
  final DateTime createdAt;
  final DateTime updatedAt;

  const JobLocation({
    required this.id,
    required this.jobId,
    required this.locationName,
    this.address,
    required this.latitude,
    required this.longitude,
    required this.hoursRequired,
    this.startTime,
    this.endTime,
    required this.requiredGuards,
    this.specialRequirements,
    required this.createdAt,
    required this.updatedAt,
  });

  factory JobLocation.fromJson(Map<String, dynamic> json) {
    return JobLocation(
      id: json['id'],
      jobId: json['job_id'],
      locationName: json['location_name'],
      address: json['address'],
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      hoursRequired: (json['hours_required'] ?? 0.0).toDouble(),
      startTime: json['start_time'],
      endTime: json['end_time'],
      requiredGuards: json['required_guards'] ?? 1,
      specialRequirements: json['special_requirements'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'job_id': jobId,
      'location_name': locationName,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'hours_required': hoursRequired,
      'start_time': startTime,
      'end_time': endTime,
      'required_guards': requiredGuards,
      'special_requirements': specialRequirements,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  JobLocation copyWith({
    String? id,
    String? jobId,
    String? locationName,
    String? address,
    double? latitude,
    double? longitude,
    double? hoursRequired,
    String? startTime,
    String? endTime,
    int? requiredGuards,
    String? specialRequirements,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return JobLocation(
      id: id ?? this.id,
      jobId: jobId ?? this.jobId,
      locationName: locationName ?? this.locationName,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      hoursRequired: hoursRequired ?? this.hoursRequired,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      requiredGuards: requiredGuards ?? this.requiredGuards,
      specialRequirements: specialRequirements ?? this.specialRequirements,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

