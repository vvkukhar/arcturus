import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityTimelineQuickChips extends ConsumerWidget {
  final String? value;
  final ValueChanged<String?> onChanged;
  final VoidCallback onClear;

  const ActivityTimelineQuickChips({
    super.key,
    required this.value,
    required this.onChanged,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    const values = <String?>[null, 'report', 'purchase', 'sale', 'watchlist'];

    String label(String? v) {
      switch (v) {
        case null:
          return i18n.t('All');
        case 'report':
          return i18n.t('Reports');
        case 'purchase':
          return i18n.t('Purchases');
        case 'sale':
          return i18n.t('Sales');
        case 'watchlist':
          return i18n.t('Watchlist');
        default:
          return v ?? '';
      }
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...values.map(
              (v) => ChoiceChip(
                label: Text(label(v)),
                selected: value == v,
                onSelected: (_) => onChanged(v),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: Text(i18n.t('common.clear')),
            ),
          ],
        ),
      ),
    );
  }
}