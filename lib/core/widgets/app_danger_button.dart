import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppDangerButton extends ConsumerWidget {
  final VoidCallback? onPressed;
  final String title;

  const AppDangerButton({
    super.key,
    required this.onPressed,
    required this.title,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return FilledButton.tonal(
      onPressed: onPressed,
      child: Text(i18n.t(title)),
    );
  }
}