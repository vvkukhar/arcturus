import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_preview_mode_provider.dart';

class AnalyticsRepricePreviewModeBar extends ConsumerWidget {
  final AnalyticsRepricePreviewMode value;
  final ValueChanged<AnalyticsRepricePreviewMode> onChanged;

  const AnalyticsRepricePreviewModeBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return SegmentedButton<AnalyticsRepricePreviewMode>(
      segments: [
        ButtonSegment<AnalyticsRepricePreviewMode>(
          value: AnalyticsRepricePreviewMode.cards,
          label: Text(i18n.t('Cards')),
          icon: const Icon(Icons.view_stream),
        ),
        ButtonSegment<AnalyticsRepricePreviewMode>(
          value: AnalyticsRepricePreviewMode.table,
          label: Text(i18n.t('Table')),
          icon: const Icon(Icons.table_rows),
        ),
      ],
      selected: {value},
      onSelectionChanged: (selection) {
        onChanged(selection.first);
      },
    );
  }
}