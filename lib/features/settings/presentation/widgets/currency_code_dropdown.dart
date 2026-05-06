import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class CurrencyCodeDropdown extends ConsumerWidget {
  final String value;
  final List<String> items;
  final ValueChanged<String?> onChanged;
  final String label;

  const CurrencyCodeDropdown({
    super.key,
    required this.value,
    required this.items,
    required this.onChanged,
    required this.label,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(labelText: i18n.t(label)),
      items: items
          .map(
            (e) => DropdownMenuItem<String>(
              value: e,
              child: Text(e),
            ),
          )
          .toList(),
      onChanged: onChanged,
    );
  }
}