// lib/features/partout/application/partout_ui_state.dart

import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';

class PartOutUiState {
  final String query;
  final PartOutFilterModel filter;
  final PartOutSortOption sortOption;

  const PartOutUiState({
    required this.query,
    required this.filter,
    required this.sortOption,
  });

  factory PartOutUiState.initial() {
    return const PartOutUiState(
      query: '',
      filter: PartOutFilterModel.empty,
      sortOption: PartOutSortOption.newest,
    );
  }

  PartOutUiState copyWith({
    String? query,
    PartOutFilterModel? filter,
    PartOutSortOption? sortOption,
  }) {
    return PartOutUiState(
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}
