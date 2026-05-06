import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';

class PartOutProjectCard extends ConsumerWidget {
  final PartOutProjectModel project;
  final VoidCallback onTap;

  const PartOutProjectCard({
    super.key,
    required this.project,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
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
              Text('${i18n.t('Status')}: ${i18n.t(project.status.name)}'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  Text('${i18n.t('Cost')}: ${project.totalCost.toStringAsFixed(2)}'),
                  Text('${i18n.t('Expected')}: ${project.expectedPartOutValue.toStringAsFixed(2)}'),
                  Text('${i18n.t('Profit')}: ${expectedProfit.toStringAsFixed(2)}'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}