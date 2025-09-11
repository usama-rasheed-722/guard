import 'user_model.dart';
import 'job_location_model.dart';
import 'application_model.dart';

class Job {
  final String id;
  final String companyId;
  final String title;
  final String? description;
  final DateTime date;
  final String startTime;
  final String endTime;
  final double hourlyRate;
  final double totalHours;
  final int requiredGuards;
  final int hiredGuards;
  final String status;
  final Map<String, dynamic>? requirements;
  final String? specialInstructions;
  final double? totalBudget;
  final DateTime createdAt;
  final DateTime updatedAt;
  final User? company;
  final List<JobLocation>? locations;
  final List<Application>? applications;

  Job({
    required this.id,
    required this.companyId,
    required this.title,
    this.description,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.hourlyRate,
    required this.totalHours,
    required this.requiredGuards,
    required this.hiredGuards,
    required this.status,
    this.requirements,
    this.specialInstructions,
    this.totalBudget,
    required this.createdAt,
    required this.updatedAt,
    this.company,
    this.locations,
    this.applications,
  });

  Job copyWith({
    String? id,
    String? companyId,
    String? title,
    String? description,
    DateTime? date,
    String? startTime,
    String? endTime,
    double? hourlyRate,
    double? totalHours,
    int? requiredGuards,
    int? hiredGuards,
    String? status,
    Map<String, dynamic>? requirements,
    String? specialInstructions,
    double? totalBudget,
    DateTime? createdAt,
    DateTime? updatedAt,
    User? company,
    List<JobLocation>? locations,
    List<Application>? applications,
  }) {
    return Job(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      title: title ?? this.title,
      description: description ?? this.description,
      date: date ?? this.date,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      hourlyRate: hourlyRate ?? this.hourlyRate,
      totalHours: totalHours ?? this.totalHours,
      requiredGuards: requiredGuards ?? this.requiredGuards,
      hiredGuards: hiredGuards ?? this.hiredGuards,
      status: status ?? this.status,
      requirements: requirements ?? this.requirements,
      specialInstructions: specialInstructions ?? this.specialInstructions,
      totalBudget: totalBudget ?? this.totalBudget,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      company: company ?? this.company,
      locations: locations ?? this.locations,
      applications: applications ?? this.applications,
    );
  }

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'],
      companyId: json['company_id'],
      title: json['title'],
      description: json['description'],
      date: DateTime.parse(json['date']),
      startTime: json['start_time'],
      endTime: json['end_time'],
      hourlyRate: (json['hourly_rate'] ?? 0.0).toDouble(),
      totalHours: (json['total_hours'] ?? 0.0).toDouble(),
      requiredGuards: json['required_guards'] ?? 1,
      hiredGuards: json['hired_guards'] ?? 0,
      status: json['status'],
      requirements: json['requirements'],
      specialInstructions: json['special_instructions'],
      totalBudget: json['total_budget']?.toDouble(),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      company: json['company'] != null ? User.fromJson(json['company']) : null,
      locations: json['locations'] != null 
          ? (json['locations'] as List).map((e) => JobLocation.fromJson(e)).toList()
          : null,
      applications: json['applications'] != null
          ? (json['applications'] as List)
              .map((e) => Application.fromJson(e))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_id': companyId,
      'title': title,
      'description': description,
      'date': date.toIso8601String(),
      'start_time': startTime,
      'end_time': endTime,
      'hourly_rate': hourlyRate,
      'total_hours': totalHours,
      'required_guards': requiredGuards,
      'hired_guards': hiredGuards,
      'status': status,
      'requirements': requirements,
      'special_instructions': specialInstructions,
      'total_budget': totalBudget,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'company': company?.toJson(),
      'locations': locations?.map((e) => e.toJson()).toList(),
      'applications': applications?.map((e) => e.toJson()).toList(),
    };
  }

  bool get isOpen => status == 'open';
  bool get isHiring => status == 'hiring';
  bool get isHired => status == 'hired';
  bool get isInProgress => status == 'in_progress';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
  bool get isFullyHired => hiredGuards >= requiredGuards;
  bool get hasOpenings => hiredGuards < requiredGuards;
}

// JobLocation and Application moved to separate model files.

// Shift model is defined in models/shift_model.dart