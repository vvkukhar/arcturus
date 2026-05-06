import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AnalyticsRepriceConfirmationDialog extends ConsumerWidget {
  final String title;
  final String subtitle;

  const AnalyticsRepriceConfirmationDialog({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return AlertDialog(
      title: Text(i18n.t(title)),
      content: Text(i18n.t(subtitle)),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(i18n.t('common.cancel')),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(i18n.t('common.apply')),
        ),
      ],
    );
  }
}