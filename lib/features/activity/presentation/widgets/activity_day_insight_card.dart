import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_day_insight_model.dart';

class ActivityDayInsightCard extends ConsumerWidget {
  final ActivityDayInsightModel? model;

  const ActivityDayInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    if (model == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(
                label:
                    Text('${i18n.t('Best')}: ${model!.bestDay} (${model!.bestDayTotal})')),
            Chip(
              label: Text(
                '${i18n.t('Weakest')}: ${model!.weakestDay} (${model!.weakestDayTotal})',
              ),
            ),
          ],
        ),
      ),
    );
  }
}