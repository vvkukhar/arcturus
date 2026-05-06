import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DealToWatchlistButton extends ConsumerWidget {
  final VoidCallback onPressed;

  const DealToWatchlistButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return FilledButton.tonalIcon(
      onPressed: onPressed,
      icon: const Icon(Icons.bookmark_add_outlined),
      label: Text(i18n.t('To Watchlist Draft')),
    );
  }
}