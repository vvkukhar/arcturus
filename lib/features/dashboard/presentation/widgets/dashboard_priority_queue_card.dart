import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_priority_queue_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_priority_queue_action_provider.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_priority_queue_item_action_bar.dart';

class DashboardPriorityQueueCard extends ConsumerWidget {
  final List<DashboardPriorityQueueItemModel> items;

  const DashboardPriorityQueueCard({
    super.key,
    required this.items,
  });

  Color _color(String type) {
    switch (type) {
      case 'buy':
        return Colors.green;
      case 'sell':
        return Colors.blue;
      case 'reprice':
        return Colors.orange;
      case 'review':
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(dashboardPriorityQueueActionProvider);
    final controller = ref.read(dashboardPriorityQueueActionProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Text(i18n.t('No priority actions right now.')),
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
              i18n.t('Priority Queue'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(8).map(
              (item) {
                final color = _color(item.type);
                final id = '${item.type}:${item.title}:${item.score}';
                final isDone = state.doneIds.contains(id);
                final isSkipped = state.skippedIds.contains(id);
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDone
                          ? Colors.green.withValues(alpha: 0.08)
                          : isSkipped
                              ? Colors.orange.withValues(alpha: 0.08)
                              : Colors.white.withValues(alpha: 0.02),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isDone
                            ? Colors.green.withValues(alpha: 0.35)
                            : isSkipped
                                ? Colors.orange.withValues(alpha: 0.35)
                                : Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                i18n.t(item.type),
                                style: TextStyle(
                                  color: color,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            Text(
                              item.score.toStringAsFixed(0),
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(i18n.t(item.reason)),
                        const SizedBox(height: 10),
                        if (isDone)
                          Text(
                            i18n.t('Status: done'),
                            style: const TextStyle(
                              color: Colors.green,
                              fontWeight: FontWeight.w800,
                            ),
                          )
                        else if (isSkipped)
                          Text(
                            i18n.t('Status: skipped'),
                            style: const TextStyle(
                              color: Colors.orange,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        const SizedBox(height: 8),
                        DashboardPriorityQueueItemActionBar(
                          onDone: () => controller.markDone(id),
                          onSkip: () => controller.markSkipped(id),
                          onReset: () => controller.reset(id),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}