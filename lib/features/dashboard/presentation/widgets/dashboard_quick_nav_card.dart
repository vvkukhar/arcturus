// lib/features/dashboard/presentation/widgets/dashboard_quick_nav_card.dart

import 'package:flutter/material.dart';

class DashboardQuickNavCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const DashboardQuickNavCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
