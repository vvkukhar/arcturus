import 'package:flutter/material.dart';

class AppNumberInput extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;
  final ValueChanged<String>? onChanged;

  const AppNumberInput({
    super.key,
    required this.controller,
    required this.label,
    this.validator,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(labelText: label),
      validator: validator,
      onChanged: onChanged,
    );
  }
}
