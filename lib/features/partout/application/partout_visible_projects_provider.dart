import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_controller.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';
import 'package:lego_trading_manager/features/partout/application/partout_ui_controller.dart';

final partOutVisibleProjectsProvider = Provider<List<PartOutProjectModel>>((ref) {
  final projects = ref.watch(partOutControllerProvider).projects;
  final ui = ref.watch(partOutUiControllerProvider);

  final query = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final filterStatusName = filter.status?.name;
  final titleQuery = filter.titleContains?.trim().toLowerCase() ?? '';

  // ОПТИМІЗАЦІЯ: Один прохід для фільтрації
  var result = projects.where((project) {
    if (query.isNotEmpty) {
      final matchesQuery = project.sourceSetTitle.toLowerCase().contains(query) ||
          (project.notes ?? '').toLowerCase().contains(query) ||
          project.status.name.toLowerCase().contains(query);
      if (!matchesQuery) return false;
    }

    if (filterStatusName != null && project.status.name != filterStatusName) {
      return false;
    }

    if (titleQuery.isNotEmpty && !project.sourceSetTitle.toLowerCase().contains(titleQuery)) {
      return false;
    }

    if (filter.onlyProfitableExpected) {
      final expectedProfit = PartOutCalculator.expectedProfit(
        totalCost: project.totalCost,
        expectedPartOutValue: project.expectedPartOutValue,
      );
      if (expectedProfit <= 0) return false;
    }

    if (filter.onlyProfitableActual) {
      final actualProfit = PartOutCalculator.actualProfit(
        totalCost: project.totalCost,
        actualPartOutValue: project.actualPartOutValue,
      );
      if (actualProfit <= 0) return false;
    }

    if (filter.onlyWithNotes && (project.notes ?? '').trim().isEmpty) {
      return false;
    }

    return true;
  }).toList();

  switch (ui.sortOption) {
    case PartOutSortOption.newest:
      result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      break;
    case PartOutSortOption.oldest:
      result.sort((a, b) => a.createdAt.compareTo(b.createdAt));
      break;
    case PartOutSortOption.titleAsc:
      result.sort((a, b) => a.sourceSetTitle.toLowerCase().compareTo(b.sourceSetTitle.toLowerCase()));
      break;
    case PartOutSortOption.titleDesc:
      result.sort((a, b) => b.sourceSetTitle.toLowerCase().compareTo(a.sourceSetTitle.toLowerCase()));
      break;
    case PartOutSortOption.costHighToLow:
      result.sort((a, b) => b.totalCost.compareTo(a.totalCost));
      break;
    case PartOutSortOption.expectedHighToLow:
      result.sort((a, b) => b.expectedPartOutValue.compareTo(a.expectedPartOutValue));
      break;
    case PartOutSortOption.actualHighToLow:
      result.sort((a, b) => b.actualPartOutValue.compareTo(a.actualPartOutValue));
      break;
    case PartOutSortOption.profitExpectedHighToLow:
      result.sort((a, b) {
        final aProfit = PartOutCalculator.expectedProfit(totalCost: a.totalCost, expectedPartOutValue: a.expectedPartOutValue);
        final bProfit = PartOutCalculator.expectedProfit(totalCost: b.totalCost, expectedPartOutValue: b.expectedPartOutValue);
        return bProfit.compareTo(aProfit);
      });
      break;
    case PartOutSortOption.profitActualHighToLow:
      result.sort((a, b) {
        final aProfit = PartOutCalculator.actualProfit(totalCost: a.totalCost, actualPartOutValue: a.actualPartOutValue);
        final bProfit = PartOutCalculator.actualProfit(totalCost: b.totalCost, actualPartOutValue: b.expectedPartOutValue);
        return bProfit.compareTo(aProfit);
      });
      break;
  }

  return result;
});