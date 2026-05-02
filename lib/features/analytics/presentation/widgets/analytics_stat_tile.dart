import 'package:flutter/material.dart';

class AnalyticsStatTile extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;

  const AnalyticsStatTile({
    super.key,
    required this.title,
    required this.value,
    required this.subtitle,
  });

  Color? _valueColor(BuildContext context) {
    final normalized = value.toLowerCase();

    if (normalized.contains('-')) {
      return Colors.redAccent;
    }

    if (title.toLowerCase().contains('profit')) {
      return Colors.green;
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    final valueColor = _valueColor(context);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: valueColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
