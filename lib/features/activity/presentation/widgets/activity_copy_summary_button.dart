import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ActivityCopySummaryButton extends StatelessWidget {
  final String text;

  const ActivityCopySummaryButton({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    return FilledButton.tonalIcon(
      onPressed: () async {
        await Clipboard.setData(ClipboardData(text: text));
        scaffoldMessenger.showSnackBar(
          const SnackBar(content: Text('Summary copied')),
        );
      },
      icon: const Icon(Icons.copy),
      label: const Text('Copy'),
    );
  }
}