import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class UnresolvedMatchDetailsSheet extends ConsumerWidget {
  final Map<String, dynamic> item;
  final VoidCallback onResolve;
  final VoidCallback onDismiss;

  const UnresolvedMatchDetailsSheet({
    super.key,
    required this.item,
    required this.onResolve,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listing = Map<String, dynamic>.from(item['listing'] as Map? ?? {});
    final i18n = ref.watch(i18nProvider.notifier);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            item['titleRaw'] as String? ?? '',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          Text('${i18n.t('Source')}: ${item['sourceCode'] ?? '-'}'),
          Text('Normalized: ${item['normalizedTitle'] ?? '-'}'),
          Text('Extracted set: ${item['extractedSetNo'] ?? '-'}'),
          Text('Suggested item: ${item['suggestedItemId'] ?? '-'}'),
          const SizedBox(height: 12),
          Text('Listing URL: ${listing['url'] ?? '-'}'),
          Text(
              'Raw price: ${listing['price'] ?? '-'} ${listing['currency'] ?? ''}'),
          Text('${i18n.t('pur.seller')}: ${listing['sellerName'] ?? '-'}'),
          Text('${i18n.t('inv.condition')}: ${listing['condition'] ?? '-'}'),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              FilledButton(
                onPressed: onResolve,
                child: Text(i18n.t('Resolve')),
              ),
              FilledButton.tonal(
                onPressed: onDismiss,
                child: Text(i18n.t('Dismiss')),
              ),
            ],
          ),
        ],
      ),
    );
  }
}