import 'package:flutter/material.dart';

class AnalyticsRepriceConfirmationDialog extends StatelessWidget {
  final String title;
  final String subtitle;

  const AnalyticsRepriceConfirmationDialog({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(title),
      content: Text(subtitle),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: const Text('Apply'),
        ),
      ],
    );
  }
}
