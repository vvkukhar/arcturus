import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/persistence_provider.dart';
import 'package:lego_trading_manager/core/bootstrap/app_reload_service.dart';

class AppBootstrapController extends Notifier<AsyncValue<void>> {
  @override
  AsyncValue<void> build() {
    return const AsyncValue.loading();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();

    try {
      await ref.read(storePersistenceManagerProvider).bootstrap();
      await ref.read(appReloadServiceProvider).reloadPersistentData();

      state = const AsyncValue.data(null);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }
}

final appBootstrapControllerProvider =
    NotifierProvider<AppBootstrapController, AsyncValue<void>>(
  AppBootstrapController.new,
);