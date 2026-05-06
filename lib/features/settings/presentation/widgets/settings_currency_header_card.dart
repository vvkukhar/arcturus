import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SettingsCurrencyHeaderCard extends ConsumerWidget {
  final String baseCurrency;
  final bool useOfficialRates;

  const SettingsCurrencyHeaderCard({
    super.key,
    required this.baseCurrency,
    required this.useOfficialRates,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Currency Overview'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 10),
            Text('${i18n.t('Base currency')}: $baseCurrency'),
            Text('${i18n.t('Official rates')}: ${useOfficialRates ? i18n.t('enabled') : i18n.t('disabled')}'),
          ],
        ),
      ),
    );
  }
}