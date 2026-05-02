import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_badge_service.dart';

final commandCenterBadgeProvider = Provider<CommandCenterBadgeService>((ref) {
  return CommandCenterBadgeService();
});
