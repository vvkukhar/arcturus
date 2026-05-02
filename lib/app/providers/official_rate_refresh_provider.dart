import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/official_rate_refresh_usecase.dart';

final officialRateRefreshUsecaseProvider =
    Provider<OfficialRateRefreshUsecase>((ref) {
  return OfficialRateRefreshUsecase(ref);
});
