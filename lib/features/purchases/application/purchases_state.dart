import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';

class PurchasesState {
  final List<PurchaseModel> allPurchases;
  final List<PurchaseModel> visiblePurchases;
  final String query;
  final PurchasesFilterModel filter;
  final PurchasesSortOption sortOption;

  const PurchasesState({
    required this.allPurchases,
    required this.visiblePurchases,
    required this.query,
    required this.filter,
    required this.sortOption,
  });

  factory PurchasesState.initial() {
    return const PurchasesState(
      allPurchases: [],
      visiblePurchases: [],
      query: '',
      filter: PurchasesFilterModel.empty,
      sortOption: PurchasesSortOption.newest,
    );
  }

  PurchasesState copyWith({
    List<PurchaseModel>? allPurchases,
    List<PurchaseModel>? visiblePurchases,
    String? query,
    PurchasesFilterModel? filter,
    PurchasesSortOption? sortOption,
  }) {
    return PurchasesState(
      allPurchases: allPurchases ?? this.allPurchases,
      visiblePurchases: visiblePurchases ?? this.visiblePurchases,
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}