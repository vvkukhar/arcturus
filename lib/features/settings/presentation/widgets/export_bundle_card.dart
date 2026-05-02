import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/export_bundle_model.dart';

class ExportBundleCard extends StatelessWidget {
  final ExportBundleModel bundle;

  const ExportBundleCard({
    super.key,
    required this.bundle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(bundle.title),
        subtitle: Text(bundle.fileName),
        trailing: Text(
          bundle.recordCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}