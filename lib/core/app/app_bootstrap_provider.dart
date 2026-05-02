import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/background_fetch_trigger.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_execution_summary_provider.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/review_flow_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_provider.dart';

final appBootstrapProvider = FutureProvider<void>((ref) async {
  await ref.read(backgroundFetchTriggerProvider.future);
  await Future.wait([
    ref.read(dashboardExecutionSummaryProvider.future),
    ref.read(purchaseFlowProvider.future),
    ref.read(repriceFlowProvider.future),
    ref.read(reviewFlowProvider.future),
    ref.read(inventoryProvider.future),
    ref.read(watchlistProvider.future),
  ]);
});
