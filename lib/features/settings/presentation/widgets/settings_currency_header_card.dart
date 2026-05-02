import 'package:flutter/material.dart';

class SettingsCurrencyHeaderCard extends StatelessWidget {
  final String baseCurrency;
  final bool useOfficialRates;

  const SettingsCurrencyHeaderCard({
    super.key,
    required this.baseCurrency,
    required this.useOfficialRates,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Currency Overview',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 10),
            Text('Base currency: $baseCurrency'),
            Text('Official rates: ${useOfficialRates ? 'enabled' : 'disabled'}'),
          ],
        ),
      ),
    );
  }
}