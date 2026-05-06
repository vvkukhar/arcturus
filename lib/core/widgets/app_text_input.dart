import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppTextInput extends ConsumerWidget {
  final TextEditingController controller;
  final String label;
  final String? hintText;
  final String? Function(String?)? validator;

  const AppTextInput({
    super.key,
    required this.controller,
    required this.label,
    this.hintText,
    this.validator,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: i18n.t(label),
        hintText: hintText != null ? i18n.t(hintText!) : null,
      ),
      validator: validator,
    );
  }
}