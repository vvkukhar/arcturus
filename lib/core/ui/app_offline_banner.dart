import 'package:flutter/material.dart';

class AppOfflineBanner extends StatelessWidget {
  const AppOfflineBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.red.withValues(alpha: 0.15),
      child: const Padding(
        padding: EdgeInsets.all(10),
        child: Row(
          children: [
            Icon(Icons.wifi_off),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'No internet connection. Changes will be synced later.',
              ),
            ),
          ],
        ),
      ),
    );
  }
}