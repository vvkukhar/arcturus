import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_health_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_value_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_allocated_profit_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_stock_flow_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/inventory_stock_health_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/inventory_stock_summary_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/inventory_stock_value_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/purchase_stock_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sales_allocated_profit_summary_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sales_stock_flow_summary_card.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class InventoryFlowScreen extends ConsumerWidget {
  const InventoryFlowScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summary = ref.watch(inventoryStockSummaryProvider);
    final value = ref.watch(inventoryStockValueProvider);
    final health = ref.watch(inventoryStockHealthProvider);
    final allocatedProfit = ref.watch(salesAllocatedProfitSummaryProvider);
    final stockFlow = ref.watch(salesStockFlowSummaryProvider);
    final purchases = ref.watch(purchasesWithStockProvider);
    final currency = ref.watch(appSettingsControllerProvider).baseCurrency;

    final openLots = purchases.where((purchase) {
      return purchase.remainingQuantity > 0;
    }).toList();

    final closedLots = purchases.where((purchase) {
      return purchase.remainingQuantity <= 0;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory Flow'),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          InventoryStockSummaryCard(model: summary),
          const SizedBox(height: 12),
          InventoryStockHealthCard(model: health),
          const SizedBox(height: 12),
          InventoryStockValueCard(
            model: value,
            currency: currency,
          ),
          const SizedBox(height: 12),
          SalesStockFlowSummaryCard(model: stockFlow),
          const SizedBox(height: 12),
          SalesAllocatedProfitSummaryCard(
            model: allocatedProfit,
            currency: currency,
          ),
          const SizedBox(height: 20),
          const Text(
            'Open Purchase Lots',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          if (openLots.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No open purchase lots.'),
              ),
            )
          else
            ...openLots.map(
              (purchase) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: PurchaseStockCard(purchase: purchase),
              ),
            ),
          const SizedBox(height: 20),
          const Text(
            'Closed Purchase Lots',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          if (closedLots.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No fully sold lots yet.'),
              ),
            )
          else
            ...closedLots.map(
              (purchase) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: PurchaseStockCard(purchase: purchase),
              ),
            ),
        ],
      ),
    );
  }
}