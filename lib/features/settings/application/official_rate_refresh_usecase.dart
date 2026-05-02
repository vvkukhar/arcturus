// lib/features/settings/application/official_rate_refresh_usecase.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rate_sync_provider.dart';

class OfficialRateRefreshUsecase {
  final Ref ref;

  OfficialRateRefreshUsecase(this.ref);

  Future<void> run() async {
    await ref.read(officialRateSyncServiceProvider).sync();
  }
}
