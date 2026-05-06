import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistBuyQueueActionBar extends ConsumerWidget {
  final VoidCallback onAddToPurchaseFlow;

  const WatchlistBuyQueueActionBar({
    super.key,
    required this.onAddToPurchaseFlow,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Row(
      children: [
        FilledButton(
          onPressed: onAddToPurchaseFlow,
          child: Text(i18n.t('Add to purchase flow')),
        ),
      ],
    );
  }
}