import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_date_range_quick_filter_provider.dart';

class ActivityDateRangeQuickChips extends StatelessWidget {
  final ActivityDateRangeQuickFilter value;
  final ValueChanged<ActivityDateRangeQuickFilter> onChanged;

  const ActivityDateRangeQuickChips({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(ActivityDateRangeQuickFilter filter) {
    switch (filter) {
      case ActivityDateRangeQuickFilter.all:
        return 'All';
      case ActivityDateRangeQuickFilter.today:
        return 'Today';
      case ActivityDateRangeQuickFilter.last3days:
        return '3 days';
      case ActivityDateRangeQuickFilter.last7days:
        return '7 days';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: ActivityDateRangeQuickFilter.values.map((filter) {
        return ChoiceChip(
          label: Text(_label(filter)),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}
