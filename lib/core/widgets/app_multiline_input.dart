import 'package:flutter/material.dart';

class AppMultilineInput extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(labelText: label),
    );
  }
}
