import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_rates_controller.dart';

final manualRatesCountProvider = Provider<int>((ref) {
  return ref.watch(manualRatesControllerProvider).length;
});