import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_view_mode_provider.dart';

class ActivityTimelineViewModeBar extends ConsumerWidget {
  final ActivityTimelineViewMode value;
  final ValueChanged<ActivityTimelineViewMode> onChanged;

  const ActivityTimelineViewModeBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return SegmentedButton<ActivityTimelineViewMode>(
      segments: [
        ButtonSegment<ActivityTimelineViewMode>(
          value: ActivityTimelineViewMode.compact,
          label: Text(i18n.t('Compact')),
          icon: const Icon(Icons.view_headline),
        ),
        ButtonSegment<ActivityTimelineViewMode>(
          value: ActivityTimelineViewMode.detailed,
          label: Text(i18n.t('Detailed')),
          icon: const Icon(Icons.view_agenda),
        ),
      ],
      selected: {value},
      onSelectionChanged: (set) {
        onChanged(set.first);
      },
    );
  }
}