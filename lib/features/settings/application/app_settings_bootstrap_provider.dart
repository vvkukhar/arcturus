import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

final appSettingsBootstrapProvider = FutureProvider<void>((ref) async {
  await ref.read(appSettingsControllerProvider.notifier).load();
});