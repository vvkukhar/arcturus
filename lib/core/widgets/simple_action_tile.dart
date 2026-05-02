import 'package:flutter/material.dart';

class SimpleActionTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final IconData? icon;

  const SimpleActionTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: icon == null ? null : Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
