import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/settings_dashboard_entry_model.dart';

class SettingsDashboardCard extends StatelessWidget {
  final SettingsDashboardEntryModel entry;

  const SettingsDashboardCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(entry.title),
            const SizedBox(height: 8),
            Text(
              entry.value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              entry.subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}