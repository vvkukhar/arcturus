import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/capital_allocation_entry_model.dart';

class CapitalAllocationCard extends ConsumerWidget {
  final CapitalAllocationEntryModel entry;

  const CapitalAllocationCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(i18n.t(entry.label)),
        trailing: Text(
          entry.amount.toStringAsFixed(2),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}