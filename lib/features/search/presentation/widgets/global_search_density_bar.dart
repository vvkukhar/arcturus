import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_density_mode_provider.dart';

class GlobalSearchDensityBar extends StatelessWidget {
  final GlobalSearchDensityMode value;
  final ValueChanged<GlobalSearchDensityMode> onChanged;

  const GlobalSearchDensityBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<GlobalSearchDensityMode>(
      segments: const [
        ButtonSegment<GlobalSearchDensityMode>(
          value: GlobalSearchDensityMode.comfortable,
          label: Text('Comfortable'),
          icon: Icon(Icons.view_agenda_outlined),
        ),
        ButtonSegment<GlobalSearchDensityMode>(
          value: GlobalSearchDensityMode.compact,
          label: Text('Compact'),
          icon: Icon(Icons.view_headline_outlined),
        ),
      ],
      selected: {value},
      onSelectionChanged: (set) {
        onChanged(set.first);
      },
    );
  }
}
