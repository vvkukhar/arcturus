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

class WatchlistPurchaseFlowController extends Notifier<List<WatchlistPurchaseFlowItemModel>> {
  @override
  List<WatchlistPurchaseFlowItemModel> build() {
    return const [];
  }

  void addItem(WatchlistPurchaseFlowItemModel item) {
    if (state.any((e) => e.id == item.id)) return;
    state = [...state, item];
  }

  void removeItem(String id) {
    state = state.where((e) => e.id != id).toList();
  }

  void clear() {
    state = const [];
  }
}

final watchlistPurchaseFlowProvider =
    NotifierProvider<WatchlistPurchaseFlowController, List<WatchlistPurchaseFlowItemModel>>(
  WatchlistPurchaseFlowController.new,
);