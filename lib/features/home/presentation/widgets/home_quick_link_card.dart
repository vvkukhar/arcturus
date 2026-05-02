import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/home/application/home_quick_link_model.dart';

class HomeQuickLinkCard extends StatelessWidget {
  final HomeQuickLinkModel model;
  final VoidCallback onTap;

  const HomeQuickLinkCard({
    super.key,
    required this.model,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(model.subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
