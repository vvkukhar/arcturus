// lib/features/market/application/market_ui_state.dart

import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';

class MarketUiState {
  final String query;
  final MarketFilterModel filter;
  final MarketSortOption sortOption;

  const MarketUiState({
    required this.query,
    required this.filter,
    required this.sortOption,
  });

  factory MarketUiState.initial() {
    return const MarketUiState(
      query: '',
      filter: MarketFilterModel.empty,
      sortOption: MarketSortOption.newest,
    );
  }

  MarketUiState copyWith({
    String? query,
    MarketFilterModel? filter,
    MarketSortOption? sortOption,
  }) {
    return MarketUiState(
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}
