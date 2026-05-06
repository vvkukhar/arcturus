import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppPrimaryButton extends ConsumerWidget {
  final VoidCallback? onPressed;
  final String title;

  const AppPrimaryButton({
    super.key,
    required this.onPressed,
    required this.title,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return FilledButton(
      onPressed: onPressed,
      child: Text(i18n.t(title)),
    );
  }
}