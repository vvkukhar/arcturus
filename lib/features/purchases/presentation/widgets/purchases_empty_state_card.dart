import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PurchasesEmptyStateCard extends ConsumerWidget {
  final VoidCallback onAddPurchase;

  const PurchasesEmptyStateCard({
    super.key,
    required this.onAddPurchase,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.shopping_bag_outlined, size: 42),
              const SizedBox(height: 12),
              Text(
                i18n.t('No purchases yet'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                i18n.t('Create your first purchase record to track buy cost, shipping, source and payment method.'),
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onAddPurchase,
                icon: const Icon(Icons.add),
                label: Text(i18n.t('Add Purchase')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}