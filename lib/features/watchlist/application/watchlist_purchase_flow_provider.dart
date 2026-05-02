import 'package:flutter_riverpod/flutter_riverpod.dart';

class WatchlistPurchaseFlowItemModel {
  final String id;
  final String title;
  final double targetPrice;
  final double marketPrice;

  const WatchlistPurchaseFlowItemModel({
    required this.id,
    required this.title,
    required this.targetPrice,
    required this.marketPrice,
  });
}

class WatchlistPurchaseFlowController
    extends StateNotifier<List<WatchlistPurchaseFlowItemModel>> {
  WatchlistPurchaseFlowController() : super(const []);

  void addItem(WatchlistPurchaseFlowItemModel item) {
    final exists = state.any((e) => e.id == item.id);
    if (exists) return;

    state = [...state, item];
  }

  void removeItem(String id) {
    state = state.where((e) => e.id != id).toList();
  }

  void clear() {
    state = const [];
  }
}

final watchlistPurchaseFlowProvider = StateNotifierProvider<
    WatchlistPurchaseFlowController, List<WatchlistPurchaseFlowItemModel>>(
  (ref) => WatchlistPurchaseFlowController(),
);