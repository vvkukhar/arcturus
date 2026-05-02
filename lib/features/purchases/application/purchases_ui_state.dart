import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';

class PurchasesUiState {
  final String query;
  final PurchasesSortOption sort;
  final PurchasesFilterModel filter;

  const PurchasesUiState({
    required this.query,
    required this.sort,
    required this.filter,
  });

  factory PurchasesUiState.initial() {
    return const PurchasesUiState(
      query: '',
      sort: PurchasesSortOption.newest,
      filter: PurchasesFilterModel.empty,
    );
  }

  PurchasesUiState copyWith({
    String? query,
    PurchasesSortOption? sort,
    PurchasesFilterModel? filter,
  }) {
    return PurchasesUiState(
      query: query ?? this.query,
      sort: sort ?? this.sort,
      filter: filter ?? this.filter,
    );
  }
}