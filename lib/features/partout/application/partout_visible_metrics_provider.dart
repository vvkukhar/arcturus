// lib/features/partout/application/partout_visible_metrics_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/features/partout/application/partout_visible_projects_provider.dart';

class PartOutVisibleMetricsModel {
  final int visibleCount;
  final double totalCost;
  final double totalExpected;
  final double totalActual;
  final double totalExpectedProfit;
  final double totalActualProfit;

  const PartOutVisibleMetricsModel({
    required this.visibleCount,
    required this.totalCost,
    required this.totalExpected,
    required this.totalActual,
    required this.totalExpectedProfit,
    required this.totalActualProfit,
  });
}

final partOutVisibleMetricsProvider =
    Provider<PartOutVisibleMetricsModel>((ref) {
  final projects = ref.watch(partOutVisibleProjectsProvider);

  double totalExpectedProfit = 0;
  double totalActualProfit = 0;

  for (final project in projects) {
    totalExpectedProfit += PartOutCalculator.expectedProfit(
      totalCost: project.totalCost,
      expectedPartOutValue: project.expectedPartOutValue,
    );
    totalActualProfit += PartOutCalculator.actualProfit(
      totalCost: project.totalCost,
      actualPartOutValue: project.actualPartOutValue,
    );
  }

  return PartOutVisibleMetricsModel(
    visibleCount: projects.length,
    totalCost: projects.fold<double>(0, (sum, p) => sum + p.totalCost),
    totalExpected:
        projects.fold<double>(0, (sum, p) => sum + p.expectedPartOutValue),
    totalActual:
        projects.fold<double>(0, (sum, p) => sum + p.actualPartOutValue),
    totalExpectedProfit: totalExpectedProfit,
    totalActualProfit: totalActualProfit,
  );
});
