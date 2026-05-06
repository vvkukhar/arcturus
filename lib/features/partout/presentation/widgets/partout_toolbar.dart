import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PartOutToolbar extends ConsumerWidget {
  final VoidCallback onOpenFilters;
  final Widget sortDropdown;

  const PartOutToolbar({
    super.key,
    required this.onOpenFilters,
    required this.sortDropdown,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Row(
      children: [
        Expanded(child: sortDropdown),
        const SizedBox(width: 12),
        FilledButton.tonalIcon(
          onPressed: onOpenFilters,
          icon: const Icon(Icons.tune),
          label: Text(i18n.t('common.filters')),
        ),
      ],
    );
  }
}