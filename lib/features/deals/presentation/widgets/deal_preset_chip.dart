import 'package:flutter/material.dart';

class DealPresetChip extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const DealPresetChip({
    super.key,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: Text(title),
      onPressed: onTap,
    );
  }
}
