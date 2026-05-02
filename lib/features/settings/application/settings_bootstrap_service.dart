import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/app_bootstrap_runner_provider.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class SettingsBootstrapService {
  final Ref ref;

  SettingsBootstrapService(this.ref);

  Future<void> init() async {
    await ref.read(appSettingsControllerProvider.notifier).load();
    await ref.read(appBootstrapRunnerProvider).run();
  }
}