class FeedbackModel {
  final String id;
  final String fromUserId;
  final String toUserId;
  final int rating; // 1-5
  final String? comments;
  final DateTime createdAt;
  final DateTime updatedAt;

  const FeedbackModel({
    required this.id,
    required this.fromUserId,
    required this.toUserId,
    required this.rating,
    this.comments,
    required this.createdAt,
    required this.updatedAt,
  });

  factory FeedbackModel.fromJson(Map<String, dynamic> json) {
    return FeedbackModel(
      id: json['id'],
      fromUserId: json['from_user_id'],
      toUserId: json['to_user_id'],
      rating: json['rating'] ?? 0,
      comments: json['comments'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'from_user_id': fromUserId,
      'to_user_id': toUserId,
      'rating': rating,
      'comments': comments,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  FeedbackModel copyWith({
    String? id,
    String? fromUserId,
    String? toUserId,
    int? rating,
    String? comments,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return FeedbackModel(
      id: id ?? this.id,
      fromUserId: fromUserId ?? this.fromUserId,
      toUserId: toUserId ?? this.toUserId,
      rating: rating ?? this.rating,
      comments: comments ?? this.comments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

