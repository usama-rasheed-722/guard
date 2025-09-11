import 'transaction_model.dart';

class Wallet {
  final String id;
  final String userId;
  final double balance;
  final String currency;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Transaction> transactions;

  const Wallet({
    required this.id,
    required this.userId,
    required this.balance,
    required this.currency,
    required this.createdAt,
    required this.updatedAt,
    this.transactions = const [],
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      id: json['id'],
      userId: json['user_id'],
      balance: (json['balance'] ?? 0.0).toDouble(),
      currency: json['currency'] ?? 'USD',
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      transactions: (json['transactions'] as List?)
              ?.map((e) => Transaction.fromJson(e))
              .toList() ??
          const [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'balance': balance,
      'currency': currency,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'transactions': transactions.map((e) => e.toJson()).toList(),
    };
  }

  Wallet copyWith({
    String? id,
    String? userId,
    double? balance,
    String? currency,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<Transaction>? transactions,
  }) {
    return Wallet(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      balance: balance ?? this.balance,
      currency: currency ?? this.currency,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      transactions: transactions ?? this.transactions,
    );
  }
}

