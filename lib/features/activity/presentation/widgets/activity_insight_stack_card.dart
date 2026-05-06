import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityInsightStackCard extends ConsumerWidget {
  final String momentum;
  final String balance;
  final String streakLabel;

  const ActivityInsightStackCard({
    super.key,
    required this.momentum,
    required this.balance,
    required this.streakLabel,
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
              i18n.t('Insight Stack'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Text('${i18n.t('Momentum')} • $momentum'),
            const SizedBox(height: 6),
            Text('${i18n.t('Balance')} • $balance'),
            const SizedBox(height: 6),
            Text('${i18n.t('Streak')} • $streakLabel'),
          ],
        ),
      ),
    );
  }
}