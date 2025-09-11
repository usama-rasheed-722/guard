class Transaction {
  final String id;
  final String fromUserId;
  final String toUserId;
  final String? jobId;
  final String? shiftId;
  final double amount;
  final String type; // deposit, escrow, release, withdrawal
  final String status; // pending, success, failed, hold
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Transaction({
    required this.id,
    required this.fromUserId,
    required this.toUserId,
    this.jobId,
    this.shiftId,
    required this.amount,
    required this.type,
    required this.status,
    this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      fromUserId: json['from_user_id'],
      toUserId: json['to_user_id'],
      jobId: json['job_id'],
      shiftId: json['shift_id'],
      amount: (json['amount'] ?? 0.0).toDouble(),
      type: json['type'],
      status: json['status'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'from_user_id': fromUserId,
      'to_user_id': toUserId,
      'job_id': jobId,
      'shift_id': shiftId,
      'amount': amount,
      'type': type,
      'status': status,
      'description': description,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  Transaction copyWith({
    String? id,
    String? fromUserId,
    String? toUserId,
    String? jobId,
    String? shiftId,
    double? amount,
    String? type,
    String? status,
    String? description,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Transaction(
      id: id ?? this.id,
      fromUserId: fromUserId ?? this.fromUserId,
      toUserId: toUserId ?? this.toUserId,
      jobId: jobId ?? this.jobId,
      shiftId: shiftId ?? this.shiftId,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      status: status ?? this.status,
      description: description ?? this.description,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  bool get isSuccess => status == 'success';
  bool get isPending => status == 'pending';
  bool get isFailed => status == 'failed';
  bool get isOnHold => status == 'hold';
  bool get isDeposit => type == 'deposit';
  bool get isWithdrawal => type == 'withdrawal';
  bool get isEscrow => type == 'escrow';
  bool get isRelease => type == 'release';
}

