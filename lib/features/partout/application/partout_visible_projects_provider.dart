// lib/features/partout/application/partout_visible_projects_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_controller.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';
import 'package:lego_trading_manager/features/partout/application/partout_ui_controller.dart';

final partOutVisibleProjectsProvider =
    Provider<List<PartOutProjectModel>>((ref) {
  final projects = ref.watch(partOutControllerProvider).projects;
  final ui = ref.watch(partOutUiControllerProvider);

  var result = [...projects];

  final query = ui.query.trim().toLowerCase();
  if (query.isNotEmpty) {
    result = result.where((project) {
      return project.sourceSetTitle.toLowerCase().contains(query) ||
          (project.notes ?? '').toLowerCase().contains(query) ||
          project.status.name.toLowerCase().contains(query);
    }).toList();
  }

  final filter = ui.filter;
  final filterStatusName = filter.status?.name;

  if (filterStatusName != null) {
    result = result
        .where((project) => project.status.name == filterStatusName)
        .toList();
  }

  if ((filter.titleContains ?? '').trim().isNotEmpty) {
    final titleQuery = filter.titleContains!.trim().toLowerCase();
    result = result
        .where(
          (project) =>
              project.sourceSetTitle.toLowerCase().contains(titleQuery),
        )
        .toList();
  }

  if (filter.onlyProfitableExpected) {
    result = result.where((project) {
      final expectedProfit = PartOutCalculator.expectedProfit(
        totalCost: project.totalCost,
        expectedPartOutValue: project.expectedPartOutValue,
      );
      return expectedProfit > 0;
    }).toList();
  }

  if (filter.onlyProfitableActual) {
    result = result.where((project) {
      final actualProfit = PartOutCalculator.actualProfit(
        totalCost: project.totalCost,
        actualPartOutValue: project.actualPartOutValue,
      );
      return actualProfit > 0;
    }).toList();
  }

  if (filter.onlyWithNotes) {
    result = result
        .where((project) => (project.notes ?? '').trim().isNotEmpty)
        .toList();
  }

  switch (ui.sortOption) {
    case PartOutSortOption.newest:
      result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      break;
    case PartOutSortOption.oldest:
      result.sort((a, b) => a.createdAt.compareTo(b.createdAt));
      break;
    case PartOutSortOption.titleAsc:
      result.sort(
        (a, b) => a.sourceSetTitle.toLowerCase().compareTo(
              b.sourceSetTitle.toLowerCase(),
            ),
      );
      break;
    case PartOutSortOption.titleDesc:
      result.sort(
        (a, b) => b.sourceSetTitle.toLowerCase().compareTo(
              a.sourceSetTitle.toLowerCase(),
            ),
      );
      break;
    case PartOutSortOption.costHighToLow:
      result.sort((a, b) => b.totalCost.compareTo(a.totalCost));
      break;
    case PartOutSortOption.expectedHighToLow:
      result.sort(
        (a, b) => b.expectedPartOutValue.compareTo(a.expectedPartOutValue),
      );
      break;
    case PartOutSortOption.actualHighToLow:
      result.sort(
        (a, b) => b.actualPartOutValue.compareTo(a.actualPartOutValue),
      );
      break;
    case PartOutSortOption.profitExpectedHighToLow:
      result.sort((a, b) {
        final aProfit = PartOutCalculator.expectedProfit(
          totalCost: a.totalCost,
          expectedPartOutValue: a.expectedPartOutValue,
        );
        final bProfit = PartOutCalculator.expectedProfit(
          totalCost: b.totalCost,
          expectedPartOutValue: b.expectedPartOutValue,
        );
        return bProfit.compareTo(aProfit);
      });
      break;
    case PartOutSortOption.profitActualHighToLow:
      result.sort((a, b) {
        final aProfit = PartOutCalculator.actualProfit(
          totalCost: a.totalCost,
          actualPartOutValue: a.actualPartOutValue,
        );
        final bProfit = PartOutCalculator.actualProfit(
          totalCost: b.totalCost,
          actualPartOutValue: b.actualPartOutValue,
        );
        return bProfit.compareTo(aProfit);
      });
      break;
  }

  return result;
});