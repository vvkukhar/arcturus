import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/widgets/metric_chip.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemDetailHeaderCard extends ConsumerWidget {
  final ItemModel item;

  const ItemDetailHeaderCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                MetricChip(label: i18n.t('type'), value: i18n.t(item.type.name)),
                MetricChip(label: i18n.t('status'), value: i18n.t(item.status.name)),
                MetricChip(label: i18n.t('own'), value: i18n.t(item.ownershipType.name)),
                if (item.theme != null)
                  MetricChip(label: i18n.t('theme'), value: item.theme!),
              ],
            ),
          ],
        ),
      ),
    );
  }
}