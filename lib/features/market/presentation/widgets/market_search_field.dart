// lib/features/market/presentation/widgets/market_search_field.dart

import 'package:flutter/material.dart';

class MarketSearchField extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  const MarketSearchField({
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
        hintText: 'Search by item, source, url...',
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
