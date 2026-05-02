import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/opportunity_center_entry_model.dart';

class OpportunityCenterCard extends StatelessWidget {
  final OpportunityCenterEntryModel entry;
  final VoidCallback onTap;

  const OpportunityCenterCard({
    super.key,
    required this.entry,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.title),
        subtitle: Text(entry.subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}