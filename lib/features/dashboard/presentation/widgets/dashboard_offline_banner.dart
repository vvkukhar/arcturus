import 'package:flutter/material.dart';

class DashboardOfflineBanner extends StatelessWidget {
  const DashboardOfflineBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.orange.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(12),
      child: const Padding(
        padding: EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(Icons.cloud_off),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'You are offline. Cached data is shown and changes will queue.',
              ),
            ),
          ],
        ),
      ),
    );
  }
}