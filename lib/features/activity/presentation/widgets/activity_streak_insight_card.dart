import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_insight_model.dart';

class ActivityStreakInsightCard extends ConsumerWidget {
  final ActivityStreakInsightModel model;

  const ActivityStreakInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Chip(
          label: Text('${i18n.t(model.label)} (${model.value})'),
        ),
      ),
    );
  }
}