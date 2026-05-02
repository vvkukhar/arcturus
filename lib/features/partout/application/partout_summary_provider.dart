import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/partout/application/partout_controller.dart';

class PartOutSummaryModel {
  final int projectCount;
  final int lineCount;
  final double totalCost;
  final double expectedValue;
  final double actualValue;

  const PartOutSummaryModel({
    required this.projectCount,
    required this.lineCount,
    required this.totalCost,
    required this.expectedValue,
    required this.actualValue,
  });
}

final partOutSummaryProvider = Provider<PartOutSummaryModel>((ref) {
  final state = ref.watch(partOutControllerProvider);
  final controller = ref.read(partOutControllerProvider.notifier);

  final projects = state.projects;
  final lines =
      projects.expand((project) => controller.getLines(project.id)).toList();

  return PartOutSummaryModel(
    projectCount: projects.length,
    lineCount: lines.length,
    totalCost: projects.fold<double>(0, (sum, p) => sum + p.totalCost),
    expectedValue:
        projects.fold<double>(0, (sum, p) => sum + p.expectedPartOutValue),
    actualValue:
        projects.fold<double>(0, (sum, p) => sum + p.actualPartOutValue),
  );
});
