import 'dart:isolate';
import 'package:flutter/foundation.dart'; // Додано
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';
import 'package:lego_trading_manager/core/services/currency_converter.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart';

class SmartRecommendation {
  final String title, message, severity;
  const SmartRecommendation(this.title, this.message, this.severity);
}

class RepriceSuggestion {
  final String itemId, title;
  final double current, suggested;
  const RepriceSuggestion(this.itemId, this.title, this.current, this.suggested);
}

class AnalyticsEngineState {
  final double totalInvested, totalSoldRevenue, totalNetProfit, averageRoi, averageMargin, frozenCapital, inventoryValue, automationHealthScore;
  final int soldCount, activeCount, deadStockCount;
  final Map<String, double> capitalAllocation;
  final Map<String, int> turnoverBuckets, profitBands, velocityBuckets;
  final List<SmartRecommendation> recommendations;
  final List<RepriceSuggestion> repriceSuggestions;
  final String currency;

  const AnalyticsEngineState({required this.totalInvested, required this.totalSoldRevenue, required this.totalNetProfit, required this.averageRoi, required this.averageMargin, required this.frozenCapital, required this.inventoryValue, required this.soldCount, required this.activeCount, required this.deadStockCount, required this.capitalAllocation, required this.turnoverBuckets, required this.profitBands, required this.velocityBuckets, required this.recommendations, required this.repriceSuggestions, required this.automationHealthScore, required this.currency});
}

class AnalyticsEngine extends AsyncNotifier<AnalyticsEngineState> {
  @override
  Future<AnalyticsEngineState> build() async {
    final items = ref.watch(inventoryRepositoryProvider).getAllItems();
    final sales = ref.watch(salesRepositoryProvider).getAllSales();
    final watchlist = ref.watch(watchlistRepositoryProvider).getAll();
    final converter = ref.watch(currencyConverterProvider);
    
    if (kIsWeb) {
      return _computeBackground(items, sales, watchlist, converter);
    } else {
      return await Isolate.run(() => _computeBackground(items, sales, watchlist, converter));
    }
  }

  static AnalyticsEngineState _computeBackground(List<ItemModel> items, List<SaleModel> sales, List<WatchlistItemModel> watchlist, CurrencyConverter converter) {
    double invested = 0, soldRev = 0, netProfit = 0, frozen = 0, invValue = 0, totalRoi = 0, totalMargin = 0;
    int sold = 0, active = 0, dead = 0, negativeExpected = 0;
    
    final capital = {'Planned': 0.0, 'Purchased': 0.0, 'Listed': 0.0, 'Reserved': 0.0, 'Sold': 0.0, 'Other': 0.0};
    final turn = {'< 7d': 0, '7-30d': 0, '31-90d': 0, '> 90d': 0};
    final pb = {'Loss': 0, '0-500': 0, '500-2000': 0, '> 2000': 0};
    final velocity = {'0-14d': 0, '15-45d': 0, '46-90d': 0, '90d+': 0};
    
    final recommendations = <SmartRecommendation>[];
    final repriceSuggestions = <RepriceSuggestion>[];
    final saleMap = {for (var s in sales) s.itemId: s};

    for (final item in items) {
      final totalCostConv = converter(item.totalCost);
      invested += totalCostConv;
      final stName = item.status.name;
      
      if (stName == 'planned') { capital['Planned'] = capital['Planned']! + totalCostConv; }
      else if (['purchased', 'received', 'inDelivery', 'restoring', 'readyForSale', 'found'].contains(stName)) { capital['Purchased'] = capital['Purchased']! + totalCostConv; }
      else if (stName == 'listed') { capital['Listed'] = capital['Listed']! + totalCostConv; }
      else if (stName == 'reserved') { capital['Reserved'] = capital['Reserved']! + totalCostConv; }
      else if (stName == 'sold') { capital['Sold'] = capital['Sold']! + totalCostConv; }
      else { capital['Other'] = capital['Other']! + totalCostConv; }

      final days = item.daysInInventory ?? 0;

      if (item.isActive) {
        active++;
        frozen += totalCostConv;
        final marketAvgConv = item.marketAverage != null ? converter(item.marketAverage!) : 0.0;
        invValue += marketAvgConv;
        
        if (days <= 14) { velocity['0-14d'] = velocity['0-14d']! + 1; }
        else if (days <= 45) { velocity['15-45d'] = velocity['15-45d']! + 1; }
        else if (days <= 90) { velocity['46-90d'] = velocity['46-90d']! + 1; }
        else { velocity['90d+'] = velocity['90d+']! + 1; dead++; }

        final expSaleConv = item.expectedSalePrice != null ? converter(item.expectedSalePrice!) : 0.0;
        if ((expSaleConv - totalCostConv) < 0) { negativeExpected++; }

        if (item.marketAverage != null && item.expectedSalePrice != null) {
          if ((item.expectedSalePrice! - item.marketAverage!).abs() >= 5) {
            repriceSuggestions.add(RepriceSuggestion(item.id, item.title, item.expectedSalePrice!, item.marketAverage! * 0.98));
          }
        }
      } else if (item.isSold) {
        sold++;
        final sale = saleMap[item.id];
        if (item.actualSalePrice != null && sale != null) {
          final actPriceConv = converter(item.actualSalePrice!);
          soldRev += actPriceConv;
          
          final platformFeeConv = converter(sale.platformFee, from: sale.currency);
          final shipMeConv = converter(sale.shippingPaidByMe, from: sale.currency);
          
          final net = actPriceConv - platformFeeConv - shipMeConv - totalCostConv;
          netProfit += net;
          
          totalRoi += totalCostConv > 0 ? (net / totalCostConv) * 100 : 0.0;
          totalMargin += actPriceConv > 0 ? (net / actPriceConv) * 100 : 0.0;

          if (net < 0) { pb['Loss'] = pb['Loss']! + 1; }
          else if (net <= 500) { pb['0-500'] = pb['0-500']! + 1; }
          else if (net <= 2000) { pb['500-2000'] = pb['500-2000']! + 1; }
          else { pb['> 2000'] = pb['> 2000']! + 1; }
        }

        if (days < 7) { turn['< 7d'] = turn['< 7d']! + 1; }
        else if (days <= 30) { turn['7-30d'] = turn['7-30d']! + 1; }
        else if (days <= 90) { turn['31-90d'] = turn['31-90d']! + 1; }
        else { turn['> 90d'] = turn['> 90d']! + 1; }
      }
    }

    if (dead > 0) { recommendations.add(SmartRecommendation('Dead stock pressure', '$dead items older than 90 days. Consider repricing.', 'warning')); }
    if (negativeExpected > 0) { recommendations.add(SmartRecommendation('Negative expected profit', '$negativeExpected items currently look unprofitable.', 'danger')); }
    
    final underDesired = watchlist.where((item) => item.marketPrice != null && item.marketPrice! <= item.desiredBuyPrice).length;
    if (underDesired > 0) { recommendations.add(SmartRecommendation('Buy opportunities', '$underDesired watchlist items are under desired price.', 'good')); }
    if (recommendations.isEmpty) { recommendations.add(const SmartRecommendation('Stable state', 'No major alerts detected right now.', 'neutral')); }

    repriceSuggestions.sort((a, b) => (b.current - b.suggested).abs().compareTo((a.current - a.suggested).abs()));

    return AnalyticsEngineState(totalInvested: invested, totalSoldRevenue: soldRev, totalNetProfit: netProfit, averageRoi: sold > 0 ? totalRoi / sold : 0, averageMargin: sold > 0 ? totalMargin / sold : 0, frozenCapital: frozen, inventoryValue: invValue, soldCount: sold, activeCount: active, deadStockCount: dead, capitalAllocation: capital, turnoverBuckets: turn, profitBands: pb, velocityBuckets: velocity, recommendations: recommendations, repriceSuggestions: repriceSuggestions, automationHealthScore: 85.0, currency: converter.baseCurrency);
  }

  Future<void> applyMarketRepriceToAll() async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();
    int affected = 0;

    for(var item in items) {
       if (item.marketAverage != null && item.isActive) {
           affected++;
           await repo.updateItem(item.copyWith(expectedSalePrice: item.marketAverage! * 0.98));
       }
    }
    await ref.read(activityEngineProvider.notifier).logAction('Bulk Reprice Executed', 'Applied 98% market avg to $affected items', 'inventory');
    ref.invalidateSelf();
  }

  Future<void> applyRepriceSuggestion(String itemId, double suggestedPrice) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final item = repo.getById(itemId);
    if (item == null) return;

    await repo.updateItem(item.copyWith(expectedSalePrice: suggestedPrice));
    await ref.read(activityEngineProvider.notifier).logAction('Single Reprice Applied', '${item.title} -> ${suggestedPrice.toStringAsFixed(2)}', 'inventory');
    ref.invalidateSelf();
  }
}

final analyticsEngineProvider = AsyncNotifierProvider<AnalyticsEngine, AnalyticsEngineState>(AnalyticsEngine.new);