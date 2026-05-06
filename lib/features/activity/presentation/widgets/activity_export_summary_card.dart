import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_copy_summary_button.dart';

class ActivityExportSummaryCard extends ConsumerWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityExportSummaryCard({
    super.key,
    required this.items,
  });

  String _buildText(I18nNotifier i18n) {
    if (items.isEmpty) return i18n.t('No activity summary available.');
    return items.take(7).map((item) {
      return '${item.dateLabel}: total=${item.total}, reports=${item.reports}, purchases=${item.purchases}, sales=${item.sales}';
    }).join('\n');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final text = _buildText(i18n);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ActivityCopySummaryButton(text: text),
            const SizedBox(height: 10),
            SelectableText(
              text,
              style: const TextStyle(height: 1.4),
            ),
          ],
        ),
      ),
    );
  }
}