import 'package:flutter/material.dart';

class DashboardOfflineBanner extends StatelessWidget {
  final String text;

  const DashboardOfflineBanner({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.orange.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            const Icon(Icons.cloud_off),
            const SizedBox(width: 10),
            Expanded(
              child: Text(text),
            ),
          ],
        ),
      ),
    );
  }
}