import 'package:lego_trading_manager/features/sales/application/sales_filter_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';

class SalesUiState {
  final String query;
  final SalesSortOption sort;
  final SalesFilterModel filter;

  const SalesUiState({
    required this.query,
    required this.sort,
    required this.filter,
  });

  factory SalesUiState.initial() {
    return const SalesUiState(
      query: '',
      sort: SalesSortOption.newest,
      filter: SalesFilterModel.empty,
    );
  }

  SalesUiState copyWith({
    String? query,
    SalesSortOption? sort,
    SalesFilterModel? filter,
  }) {
    return SalesUiState(
      query: query ?? this.query,
      sort: sort ?? this.sort,
      filter: filter ?? this.filter,
    );
  }
}