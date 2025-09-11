import 'package:flutter_riverpod/flutter_riverpod.dart';

// Wallet State
class WalletState {
  final bool isLoading;
  final double balance;
  final List<Transaction> transactions;
  final String? error;
  final bool isProcessingPayment;

  const WalletState({
    this.isLoading = false,
    this.balance = 0.0,
    this.transactions = const [],
    this.error,
    this.isProcessingPayment = false,
  });

  WalletState copyWith({
    bool? isLoading,
    double? balance,
    List<Transaction>? transactions,
    String? error,
    bool? isProcessingPayment,
  }) {
    return WalletState(
      isLoading: isLoading ?? this.isLoading,
      balance: balance ?? this.balance,
      transactions: transactions ?? this.transactions,
      error: error,
      isProcessingPayment: isProcessingPayment ?? this.isProcessingPayment,
    );
  }
}

// Wallet Notifier
class WalletNotifier extends Notifier<WalletState> {
  @override
  WalletState build() => const WalletState();

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setError(String? error) {
    state = state.copyWith(error: error);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void setBalance(double balance) {
    state = state.copyWith(balance: balance);
  }

  void setTransactions(List<Transaction> transactions) {
    state = state.copyWith(transactions: transactions);
  }

  void setProcessingPayment(bool isProcessing) {
    state = state.copyWith(isProcessingPayment: isProcessing);
  }

  void addTransaction(Transaction transaction) {
    state = state.copyWith(transactions: [transaction, ...state.transactions]);
  }

  Future<void> addFunds(double amount) async {
    state = state.copyWith(isProcessingPayment: true, error: null);
    try {
      // TODO: Implement add funds API call
      // await walletService.addFunds(amount);
      // state = state.copyWith(
      //   balance: state.balance + amount,
      //   isProcessingPayment: false,
      // );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isProcessingPayment: false,
      );
    }
  }

  Future<void> withdraw(double amount) async {
    state = state.copyWith(isProcessingPayment: true, error: null);
    try {
      // TODO: Implement withdraw API call
      // await walletService.withdraw(amount);
      // state = state.copyWith(
      //   balance: state.balance - amount,
      //   isProcessingPayment: false,
      // );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isProcessingPayment: false,
      );
    }
  }

  Future<void> loadWallet() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // TODO: Implement load wallet API call
      // final wallet = await walletService.getWallet();
      // state = state.copyWith(
      //   balance: wallet.balance,
      //   transactions: wallet.transactions,
      //   isLoading: false,
      // );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }
}

// Wallet Providers
final walletProvider = NotifierProvider<WalletNotifier, WalletState>(WalletNotifier.new);

final balanceProvider = Provider<double>((ref) {
  final walletState = ref.watch(walletProvider);
  return walletState.balance;
});

final transactionsProvider = Provider<List<Transaction>>((ref) {
  final walletState = ref.watch(walletProvider);
  return walletState.transactions;
});

final walletLoadingProvider = Provider<bool>((ref) {
  final walletState = ref.watch(walletProvider);
  return walletState.isLoading;
});

final walletErrorProvider = Provider<String?>((ref) {
  final walletState = ref.watch(walletProvider);
  return walletState.error;
});

final isProcessingPaymentProvider = Provider<bool>((ref) {
  final walletState = ref.watch(walletProvider);
  return walletState.isProcessingPayment;
});

// Transaction Model
class Transaction {
  final String id;
  final String fromUserId;
  final String toUserId;
  final String? jobId;
  final String? shiftId;
  final double amount;
  final String type;
  final String status;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;

  Transaction({
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

  bool get isSuccess => status == 'success';
  bool get isPending => status == 'pending';
  bool get isFailed => status == 'failed';
  bool get isDeposit => type == 'deposit';
  bool get isWithdrawal => type == 'withdrawal';
  bool get isEscrow => type == 'escrow';
  bool get isRelease => type == 'release';
}