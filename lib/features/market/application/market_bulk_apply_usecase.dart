// lib/features/market/application/market_bulk_apply_usecase.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_type.dart';

class MarketBulkApplyUsecase {
  final Ref ref;

  MarketBulkApplyUsecase(this.ref);

  void run({
    required Set<String> selectedIds,
    required MarketBulkActionType action,
  }) {
    final repo = MarketRepository();
    final current = repo.getAll();

    final next = ref.read(marketBulkActionProvider).apply(
          snapshots: current,
          selectedIds: selectedIds,
          action: action,
        );

    repo.replaceAll(next);
  }
}
