import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppMultilineInput extends ConsumerWidget {
  final TextEditingController controller;
  final String label;
  final int maxLines;

  const AppMultilineInput({
    super.key,
    required this.controller,
    required this.label,
    this.maxLines = 4,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(labelText: i18n.t(label)),
    );
  }
}