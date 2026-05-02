import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/opportunity_center_action_service.dart';

final opportunityCenterActionProvider =
    Provider<OpportunityCenterActionService>((ref) {
  return OpportunityCenterActionService();
});
