import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class MetricChip extends ConsumerWidget {
  final String label;
  final String value;

  const MetricChip({
    super.key,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Chip(
      label: Text('${i18n.t(label)}: $value'),
    );
  }
}