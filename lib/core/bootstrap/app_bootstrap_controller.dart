import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/auth/auth_service.dart';
import 'package:lego_trading_manager/core/config/api_config.dart';

class AppBootstrapController extends Notifier<AsyncValue<bool>> {
  @override
  AsyncValue<bool> build() => const AsyncValue.loading();

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final auth = AuthService(baseUrl: ApiConfig.baseUrl);
      final isAuth = await auth.isAuthenticated();

      if (!isAuth) {
        state = const AsyncValue.data(false);
        return;
      }

      ref.read(syncEngineProvider);

      state = const AsyncValue.data(true);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final appBootstrapControllerProvider = NotifierProvider<AppBootstrapController, AsyncValue<bool>>(AppBootstrapController.new);