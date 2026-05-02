import 'package:flutter/material.dart';

class AnalyticsEmptyCard extends StatelessWidget {
  final String message;

  const AnalyticsEmptyCard({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(message),
      ),
    );
  }
}