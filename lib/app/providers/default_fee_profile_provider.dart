import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/default_fee_profile_service.dart';

final defaultFeeProfileServiceProvider =
    Provider<DefaultFeeProfileService>((ref) {
  return DefaultFeeProfileService();
});
