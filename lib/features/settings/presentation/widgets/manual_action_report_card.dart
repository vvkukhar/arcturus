import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_model.dart';

class ManualActionReportCard extends StatelessWidget {
  final ManualActionReportModel report;

  const ManualActionReportCard({
    super.key,
    required this.report,
  });

  @override
  Widget build(BuildContext context) {
    final date = report.createdAt.toIso8601String().split('T').first;

    return Card(
      child: ListTile(
        title: Text(report.title),
        subtitle: Text(report.note),
        trailing: Text(
          date,
          style: const TextStyle(color: Colors.white70),
        ),
      ),
    );
  }
}