import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_best_type_insight_model.dart';

class ActivityBestTypeInsightCard extends ConsumerWidget {
  final ActivityBestTypeInsightModel? model;

  const ActivityBestTypeInsightCard({
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
        child: Chip(
          label: Text('${i18n.t('Top type')}: ${model!.topType} (${model!.count})'),
        ),
      ),
    );
  }
}