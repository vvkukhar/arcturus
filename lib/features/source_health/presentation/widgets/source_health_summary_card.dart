import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/source_health/application/source_health_summary_provider.dart';

class SourceHealthSummaryCard extends ConsumerWidget {
  final List<SourceHealthSummaryItemModel> items;

  const SourceHealthSummaryCard({
    super.key,
    required this.items,
  });

  Color _statusColor(SourceHealthSummaryItemModel item) {
    if (!item.enabled) return Colors.grey;

    if (item.latestErrorMessage != null &&
        item.latestErrorMessage!.trim().isNotEmpty) {
      return Colors.redAccent;
    }

    switch (item.latestRunStatus.toLowerCase()) {
      case 'success':
      case 'ok':
      case 'healthy':
        return Colors.green;
      case 'warning':
      case 'partial':
        return Colors.orange;
      case 'failed':
      case 'error':
        return Colors.redAccent;
      default:
        return Colors.blueGrey;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Text(i18n.t('No source health data available')),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Source Health Summary'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 12),
            ...items.take(6).map((item) {
              final color = _statusColor(item);

              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: color.withValues(alpha: 0.35),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.sourceName.isEmpty
                                  ? item.sourceCode
                                  : item.sourceName,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.14),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              item.latestRunStatus,
                              style: TextStyle(
                                color: color,
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Code: ${item.sourceCode}'),
                      Text('Enabled: ${item.enabled ? 'yes' : 'no'}'),
                      Text('Listings: ${item.listingCount}'),
                      Text('Freshness: ${item.freshnessLabel}'),
                      if (item.latestErrorMessage != null &&
                          item.latestErrorMessage!.trim().isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Text(
                          'Error: ${item.latestErrorMessage!}',
                          style: const TextStyle(
                            color: Colors.redAccent,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}