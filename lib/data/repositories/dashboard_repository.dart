// lib/data/repositories/dashboard_repository.dart

import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/utils/profit_calculator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';

class DashboardStatsModel {
  final double totalInvested;
  final double inventoryValue;
  final double netProfit;
  final int unsoldCount;
  final int listedCount;
  final int soldThisMonth;
  final double avgRoi;
  final double frozenCapital;

  const DashboardStatsModel({
    required this.totalInvested,
    required this.inventoryValue,
    required this.netProfit,
    required this.unsoldCount,
    required this.listedCount,
    required this.soldThisMonth,
    required this.avgRoi,
    required this.frozenCapital,
  });
}

class DashboardRepository {
  final InventoryRepository _inventoryRepository = InventoryRepository();
  final SalesRepository _salesRepository = SalesRepository();

  DashboardStatsModel getStats() {
    final resaleItems = _inventoryRepository
        .getAllItems()
        .where((item) => item.ownershipType == OwnershipType.resale)
        .toList();

    final soldItems = resaleItems.where((item) => item.isSold).toList();
    final unsoldItems = resaleItems.where((item) => !item.isSold).toList();
    final listedItems =
        resaleItems.where((item) => item.status == ItemStatus.listed).toList();

    final totalInvested = resaleItems.fold(
      0.0,
      (sum, item) => sum + item.totalCost,
    );

    final inventoryValue = unsoldItems.fold(
      0.0,
      (sum, item) => sum + (item.marketAverage ?? 0.0),
    );

    final frozenCapital = unsoldItems.fold(
      0.0,
      (sum, item) => sum + item.totalCost,
    );

    double totalNetProfit = 0;
    final List<double> roiList = [];

    for (final item in soldItems) {
      if (item.actualSalePrice == null) continue;
      final sale = _salesRepository.getByItemId(item.id);

      final metrics = ProfitCalculator.calculateSaleMetrics(
        purchasePrice: item.purchasePrice,
        shippingToMe: item.shippingToMe,
        extraCosts: item.extraCosts,
        actualSalePrice: item.actualSalePrice!,
        platformFee: sale?.platformFee ?? 0.0,
        shippingPaidByMe: sale?.shippingPaidByMe ?? 0.0,
      );

      totalNetProfit += metrics.netProfit;
      roiList.add(metrics.roi.toDouble());
    }

    final avgRoi = roiList.isEmpty
        ? 0.0
        : roiList.reduce((a, b) => a + b) / roiList.length;

    final now = DateTime.now();
    final soldThisMonth = soldItems.where((item) {
      final saleDate = item.saleDate;
      if (saleDate == null) return false;
      return saleDate.year == now.year && saleDate.month == now.month;
    }).length;

    return DashboardStatsModel(
      totalInvested: totalInvested,
      inventoryValue: inventoryValue,
      netProfit: totalNetProfit,
      unsoldCount: unsoldItems.length,
      listedCount: listedItems.length,
      soldThisMonth: soldThisMonth,
      avgRoi: avgRoi,
      frozenCapital: frozenCapital,
    );
  }

  List<ItemModel> getStaleInventory({int minDays = 30}) {
    final resaleItems = _inventoryRepository
        .getAllItems()
        .where((item) => item.ownershipType == OwnershipType.resale)
        .where((item) => !item.isSold)
        .toList();

    return resaleItems.where((item) {
      final days = item.daysInInventory ?? 0;
      return days >= minDays;
    }).toList();
  }

  List<ItemModel> getBestDeals() {
    final resaleItems = _inventoryRepository
        .getAllItems()
        .where((item) => item.ownershipType == OwnershipType.resale)
        .where((item) => !item.isSold)
        .toList();

    final sorted = [...resaleItems];

    sorted.sort((a, b) {
      final aExpected = (a.expectedSalePrice ?? 0.0) - a.totalCost;
      final bExpected = (b.expectedSalePrice ?? 0.0) - b.totalCost;
      return bExpected.compareTo(aExpected);
    });

    return sorted.take(5).toList();
  }
}
