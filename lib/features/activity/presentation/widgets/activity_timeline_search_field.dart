// lib/features/activity/presentation/widgets/activity_timeline_search_field.dart
import 'package:flutter/material.dart';

class ActivityTimelineSearchField extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  const ActivityTimelineSearchField({
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
        hintText: 'Search timeline...',
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
