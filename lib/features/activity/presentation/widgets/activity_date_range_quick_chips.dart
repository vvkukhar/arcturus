import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_date_range_quick_filter_provider.dart';

class ActivityDateRangeQuickChips extends ConsumerWidget {
  final ActivityDateRangeQuickFilter value;
  final ValueChanged<ActivityDateRangeQuickFilter> onChanged;

  const ActivityDateRangeQuickChips({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(ActivityDateRangeQuickFilter filter, I18nNotifier i18n) {
    switch (filter) {
      case ActivityDateRangeQuickFilter.all:
        return i18n.t('All');
      case ActivityDateRangeQuickFilter.today:
        return i18n.t('Today');
      case ActivityDateRangeQuickFilter.last3days:
        return i18n.t('3 days');
      case ActivityDateRangeQuickFilter.last7days:
        return i18n.t('7 days');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: ActivityDateRangeQuickFilter.values.map((filter) {
        return ChoiceChip(
          label: Text(_label(filter, i18n)),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}