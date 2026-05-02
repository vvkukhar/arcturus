import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_preview_mode_provider.dart';

class AnalyticsRepricePreviewModeBar extends StatelessWidget {
  final AnalyticsRepricePreviewMode value;
  final ValueChanged<AnalyticsRepricePreviewMode> onChanged;

  const AnalyticsRepricePreviewModeBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<AnalyticsRepricePreviewMode>(
      segments: const [
        ButtonSegment<AnalyticsRepricePreviewMode>(
          value: AnalyticsRepricePreviewMode.cards,
          label: Text('Cards'),
          icon: Icon(Icons.view_stream),
        ),
        ButtonSegment<AnalyticsRepricePreviewMode>(
          value: AnalyticsRepricePreviewMode.table,
          label: Text('Table'),
          icon: Icon(Icons.table_rows),
        ),
      ],
      selected: {value},
      onSelectionChanged: (selection) {
        onChanged(selection.first);
      },
    );
  }
}