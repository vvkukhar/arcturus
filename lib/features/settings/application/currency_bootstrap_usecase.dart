import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rates_loader_provider.dart';
import 'package:lego_trading_manager/features/settings/application/manual_rates_controller.dart';

class CurrencyBootstrapUsecase {
  final Ref ref;

  CurrencyBootstrapUsecase(this.ref);

  Future<void> run() async {
    await ref.read(officialRatesLoaderServiceProvider).load();
    ref.read(manualRatesControllerProvider.notifier).load();
  }
}
