import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityCopySummaryButton extends ConsumerWidget {
  final String text;

  const ActivityCopySummaryButton({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final i18n = ref.watch(i18nProvider.notifier);

    return FilledButton.tonalIcon(
      onPressed: () async {
        await Clipboard.setData(ClipboardData(text: text));
        scaffoldMessenger.showSnackBar(
          SnackBar(content: Text(i18n.t('common.copied'))),
        );
      },
      icon: const Icon(Icons.copy),
      label: const Text('Copy'),
    );
  }
}