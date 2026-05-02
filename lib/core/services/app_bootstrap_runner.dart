import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/app_bootstrap_currency_provider.dart';

class AppBootstrapRunner {
  final Ref ref;

  AppBootstrapRunner(this.ref);

  Future<void> run() async {
    await ref.read(appBootstrapCurrencyServiceProvider).warmup();
  }
}
