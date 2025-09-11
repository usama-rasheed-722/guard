import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_strings.dart';
import '../../providers/wallet_providers.dart';

class WalletScreen extends ConsumerWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balance = ref.watch(balanceProvider);
    final transactions = ref.watch(transactionsProvider);
    final isLoading = ref.watch(walletLoadingProvider);
    final error = ref.watch(walletErrorProvider);
    final isProcessing = ref.watch(isProcessingPaymentProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.wallet),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(walletProvider.notifier).loadWallet();
            },
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: AppColors.error,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Error',
                        style: AppTextStyles.headlineMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        error,
                        style: AppTextStyles.bodyMedium,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // Balance Card
                    Card(
                      margin: const EdgeInsets.all(16),
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Text(
                              'Current Balance',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '\$${balance.toStringAsFixed(2)}',
                              style: AppTextStyles.displayMedium.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Action Buttons
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: isProcessing ? null : () {
                                // TODO: Implement add funds
                              },
                              icon: isProcessing
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.add),
                              label: const Text('Add Funds'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: isProcessing ? null : () {
                                // TODO: Implement withdraw
                              },
                              icon: isProcessing
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.remove),
                              label: const Text('Withdraw'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Transactions Header
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Recent Transactions',
                            style: AppTextStyles.titleLarge,
                          ),
                          TextButton(
                            onPressed: () {
                              // TODO: Navigate to all transactions
                            },
                            child: const Text('View All'),
                          ),
                        ],
                      ),
                    ),
                    // Transactions List
                    Expanded(
                      child: transactions.isEmpty
                          ? const Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.receipt_long,
                                    size: 64,
                                    color: AppColors.primary,
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    'No Transactions',
                                    style: AppTextStyles.headlineMedium,
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Your transaction history will appear here',
                                    style: AppTextStyles.bodyMedium,
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              itemCount: transactions.length,
                              itemBuilder: (context, index) {
                                final transaction = transactions[index];
                                return Card(
                                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                                  child: ListTile(
                                    leading: Icon(
                                      transaction.isDeposit
                                          ? Icons.arrow_downward
                                          : Icons.arrow_upward,
                                      color: transaction.isDeposit
                                          ? AppColors.success
                                          : AppColors.error,
                                    ),
                                    title: Text(transaction.type.toUpperCase()),
                                    subtitle: Text(transaction.description ?? ''),
                                    trailing: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text(
                                          '${transaction.isDeposit ? '+' : '-'}\$${transaction.amount.toStringAsFixed(2)}',
                                          style: AppTextStyles.titleMedium.copyWith(
                                            color: transaction.isDeposit
                                                ? AppColors.success
                                                : AppColors.error,
                                          ),
                                        ),
                                        Text(
                                          transaction.status,
                                          style: AppTextStyles.caption.copyWith(
                                            color: transaction.isSuccess
                                                ? AppColors.success
                                                : AppColors.error,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }
}