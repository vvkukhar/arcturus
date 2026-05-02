import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';

class PartOutProjectCard extends StatelessWidget {
  final PartOutProjectModel project;
  final VoidCallback onTap;

  const PartOutProjectCard({
    super.key,
    required this.project,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final expectedProfit = PartOutCalculator.expectedProfit(
      totalCost: project.totalCost,
      expectedPartOutValue: project.expectedPartOutValue,
    );

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                project.sourceSetTitle,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 6),
              Text('Status: ${project.status.name}'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  Text('Cost: ${project.totalCost.toStringAsFixed(2)}'),
                  Text(
                      'Expected: ${project.expectedPartOutValue.toStringAsFixed(2)}'),
                  Text('Profit: ${expectedProfit.toStringAsFixed(2)}'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
