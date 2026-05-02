import 'package:flutter/material.dart';

class ManualActionReportsSearchField extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  const ManualActionReportsSearchField({
    super.key,
    required this.controller,
    required this.onChanged,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    final hasValue = controller.text.trim().isNotEmpty;

    return TextField(
      controller: controller,
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: 'Search manual reports...',
        prefixIcon: const Icon(Icons.search),
        suffixIcon: hasValue
            ? IconButton(
                onPressed: onClear,
                icon: const Icon(Icons.close),
              )
            : null,
      ),
    );
  }
}