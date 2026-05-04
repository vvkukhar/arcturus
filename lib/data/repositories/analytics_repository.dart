import 'package:lego_trading_manager/core/utils/profit_calculator.dart';
import 'package:lego_trading_manager/data/models/analytics_summary_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';

class AnalyticsRepository {
  final InventoryRepository inventoryRepository;
  final SalesRepository salesRepository;

  AnalyticsRepository({
    required this.inventoryRepository,
    required this.salesRepository,
  });

  AnalyticsSummaryModel getSummary() {
    final items = inventoryRepository.getAllItems();
    final sales = salesRepository.getAllSales();

    final soldItems = items.where((item) => item.isSold).toList();
    final activeItems = items.where((item) => item.isActive).toList();

    final totalInvested = items.fold(0.0, (sum, item) => sum + item.totalCost);
    final totalSoldRevenue = sales.fold(0.0, (sum, sale) => sum + sale.salePrice);

    double totalNetProfit = 0;
    final List<double> roiList = [];
    final List<double> marginList = [];
    final List<int> daysToSellList = [];

    for (final item in soldItems) {
      if (item.actualSalePrice == null) continue;

      final sale = salesRepository.getByItemId(item.id);
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
      marginList.add(metrics.margin.toDouble());

      if (item.daysInInventory != null) {
        daysToSellList.add(item.daysInInventory!);
      }
    }

    final frozenCapital = activeItems.fold(0.0, (sum, item) => sum + item.totalCost);

    final inventoryValue = activeItems.fold(
      0.0,
      (sum, item) => sum + (item.marketAverage ?? 0.0),
    );

    final avgRoi = roiList.isEmpty ? 0.0 : roiList.reduce((a, b) => a + b) / roiList.length;

    final avgMargin = marginList.isEmpty ? 0.0 : marginList.reduce((a, b) => a + b) / marginList.length;

    final avgDaysToSell = daysToSellList.isEmpty ? 0.0 : daysToSellList.reduce((a, b) => a + b) / daysToSellList.length;

    final deadStockCount = activeItems.where((item) {
      final days = item.daysInInventory ?? 0;
      return days >= 30;
    }).length;

    return AnalyticsSummaryModel(
      totalInvested: totalInvested,
      totalSoldRevenue: totalSoldRevenue,
      totalNetProfit: totalNetProfit,
      averageRoi: avgRoi,
      averageMargin: avgMargin,
      frozenCapital: frozenCapital,
      inventoryValue: inventoryValue,
      soldCount: soldItems.length,
      activeCount: activeItems.length,
      deadStockCount: deadStockCount,
      averageDaysToSell: avgDaysToSell,
    );
  }
}