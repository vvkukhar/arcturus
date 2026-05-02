import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_view_mode_provider.dart';

class ActivityTimelineViewModeBar extends StatelessWidget {
  final ActivityTimelineViewMode value;
  final ValueChanged<ActivityTimelineViewMode> onChanged;

  const ActivityTimelineViewModeBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<ActivityTimelineViewMode>(
      segments: const [
        ButtonSegment<ActivityTimelineViewMode>(
          value: ActivityTimelineViewMode.compact,
          label: Text('Compact'),
          icon: Icon(Icons.view_headline),
        ),
        ButtonSegment<ActivityTimelineViewMode>(
          value: ActivityTimelineViewMode.detailed,
          label: Text('Detailed'),
          icon: Icon(Icons.view_agenda),
        ),
      ],
      selected: {value},
      onSelectionChanged: (set) {
        onChanged(set.first);
      },
    );
  }
}
