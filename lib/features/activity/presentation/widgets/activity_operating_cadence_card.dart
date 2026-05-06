import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operating_cadence_model.dart';

class ActivityOperatingCadenceCard extends ConsumerWidget {
  final ActivityOperatingCadenceModel model;

  const ActivityOperatingCadenceCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(model.label),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${i18n.t('Weekly active')} ${model.weeklyActiveDays} • ${i18n.t('control')} ${model.controlScore.toStringAsFixed(0)}',
            ),
          ],
        ),
      ),
    );
  }
}