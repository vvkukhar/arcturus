import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityDayCompareCard extends ConsumerWidget {
  final String bestLabel;
  final int bestCount;
  final String weakestLabel;
  final int weakestCount;

  const ActivityDayCompareCard({
    super.key,
    required this.bestLabel,
    required this.bestCount,
    required this.weakestLabel,
    required this.weakestCount,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    i18n.t('Best day'),
                    style: const TextStyle(color: Colors.white70),
                  ),
                ),
                Text(
                  '$bestLabel • $bestCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: Text(
                    i18n.t('Weakest day'),
                    style: const TextStyle(color: Colors.white70),
                  ),
                ),
                Text(
                  '$weakestLabel • $weakestCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}