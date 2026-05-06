import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_center_provider.dart';

class InventoryActionCenterCard extends ConsumerWidget {
  final InventoryActionCenterModel model;

  const InventoryActionCenterCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Action Center'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('${i18n.t('Buy')} ${model.buy}')),
                Chip(label: Text('${i18n.t('Sell')} ${model.sell}')),
                Chip(label: Text('${i18n.t('Reprice')} ${model.reprice}')),
                Chip(label: Text('${i18n.t('Review')} ${model.review}')),
                Chip(label: Text('${i18n.t('Hold')} ${model.hold}')),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              '${i18n.t('Top action')}: ${i18n.t(model.topLabel)}',
              style: const TextStyle(
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}