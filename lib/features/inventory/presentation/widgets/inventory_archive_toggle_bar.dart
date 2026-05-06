import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryArchiveToggleBar extends ConsumerWidget {
  final bool showArchived;
  final ValueChanged<bool> onChanged;

  const InventoryArchiveToggleBar({
    super.key,
    required this.showArchived,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: SwitchListTile(
        value: showArchived,
        onChanged: onChanged,
        title: Text(i18n.t('Show archived items')),
        subtitle: Text(i18n.t('Include archived inventory in visible list')),
      ),
    );
  }
}