import 'package:lego_trading_manager/data/repositories/market_repository.dart';

class MarketBulkApplyUsecase {
  final MarketRepository repository;

  MarketBulkApplyUsecase(this.repository);

  void deleteSelected(Set<String> ids) {
    for (final id in ids) {
      repository.delete(id);
    }
  }
}