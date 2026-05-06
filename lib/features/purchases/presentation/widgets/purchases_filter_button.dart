import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PurchasesFilterButton extends ConsumerWidget {
  final VoidCallback onTap;

  const PurchasesFilterButton({
    super.key,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return FilledButton.tonalIcon(
      onPressed: onTap,
      icon: const Icon(Icons.tune),
      label: Text(i18n.t('common.filters')),
    );
  }
}