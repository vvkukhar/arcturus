import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/restore_dry_run_summary_model.dart';

class RestoreDryRunCard extends StatelessWidget {
  final RestoreDryRunSummaryModel summary;

  const RestoreDryRunCard({
    super.key,
    required this.summary,
  });

  Widget row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            row('Characters', summary.charCount.toString()),
            row('Lines', summary.lineCount.toString()),
            row('Looks like JSON', summary.looksLikeJson ? 'yes' : 'no'),
            row('Looks like Array', summary.looksLikeArray ? 'yes' : 'no'),
            row('Looks like Object', summary.looksLikeObject ? 'yes' : 'no'),
          ],
        ),
      ),
    );
  }
}