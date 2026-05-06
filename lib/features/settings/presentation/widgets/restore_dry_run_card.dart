import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/restore_dry_run_summary_model.dart';

class RestoreDryRunCard extends ConsumerWidget {
  final RestoreDryRunSummaryModel summary;

  const RestoreDryRunCard({
    super.key,
    required this.summary,
  });

  Widget row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            row(i18n.t('Characters'), summary.charCount.toString()),
            row(i18n.t('Lines'), summary.lineCount.toString()),
            row(i18n.t('Looks like JSON'), summary.looksLikeJson ? i18n.t('yes') : i18n.t('no')),
            row(i18n.t('Looks like Array'), summary.looksLikeArray ? i18n.t('yes') : i18n.t('no')),
            row(i18n.t('Looks like Object'), summary.looksLikeObject ? i18n.t('yes') : i18n.t('no')),
          ],
        ),
      ),
    );
  }
}