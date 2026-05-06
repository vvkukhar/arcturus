import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityTimelineTypeDropdown extends ConsumerWidget {
  final String? value;
  final ValueChanged<String?> onChanged;

  const ActivityTimelineTypeDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    final items = <DropdownMenuItem<String?>>[
      DropdownMenuItem<String?>(
        value: null,
        child: Text(i18n.t('activity.log.allTypes')),
      ),
      DropdownMenuItem<String?>(
        value: 'report',
        child: Text(i18n.t('activity.log.report')),
      ),
      DropdownMenuItem<String?>(
        value: 'purchase',
        child: Text(i18n.t('activity.log.purchase')),
      ),
      DropdownMenuItem<String?>(
        value: 'sale',
        child: Text(i18n.t('activity.log.sale')),
      ),
      DropdownMenuItem<String?>(
        value: 'watchlist',
        child: Text(i18n.t('activity.log.watchlist')),
      ),
      DropdownMenuItem<String?>(
        value: 'market',
        child: Text(i18n.t('activity.log.market')),
      ),
      DropdownMenuItem<String?>(
        value: 'inventory',
        child: Text(i18n.t('activity.log.inventory')),
      ),
    ];

    return DropdownButtonFormField<String?>(
      value: value,
      decoration: InputDecoration(labelText: i18n.t('inv.type')),
      items: items,
      onChanged: onChanged,
    );
  }
}