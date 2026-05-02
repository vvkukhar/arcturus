// lib/features/item_details/application/item_detail_insights_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/item_details/application/item_detail_insight_model.dart';

class ItemDetailInsightsService {
  List<ItemDetailInsightModel> build(ItemModel item) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final marketSpread = (item.marketAverage ?? 0) - item.totalCost;
    final roi =
        item.totalCost <= 0 ? 0.0 : (expectedProfit / item.totalCost) * 100;
    final margin = (item.expectedSalePrice ?? 0) <= 0
        ? 0.0
        : (expectedProfit / (item.expectedSalePrice ?? 1)) * 100;

    return [
      ItemDetailInsightModel(
        title: 'Expected Profit',
        value: expectedProfit.toStringAsFixed(2),
        subtitle: 'expected sale - total cost',
      ),
      ItemDetailInsightModel(
        title: 'Market Spread',
        value: marketSpread.toStringAsFixed(2),
        subtitle: 'market avg - total cost',
      ),
      ItemDetailInsightModel(
        title: 'ROI',
        value: '${roi.toStringAsFixed(1)}%',
        subtitle: 'return on invested capital',
      ),
      ItemDetailInsightModel(
        title: 'Margin',
        value: '${margin.toStringAsFixed(1)}%',
        subtitle: 'profit share of expected sale',
      ),
      ItemDetailInsightModel(
        title: 'Days In Inventory',
        value: (item.daysInInventory ?? 0).toString(),
        subtitle: 'holding duration',
      ),
      ItemDetailInsightModel(
        title: 'Quantity',
        value: item.quantity.toString(),
        subtitle: 'units of this item',
      ),
    ];
  }
}
