import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/bootstrap/app_reload_service.dart';

class AppBootstrapController extends StateNotifier<AsyncValue<void>> {
  final Ref ref;

  AppBootstrapController(this.ref) : super(const AsyncValue.loading());

  Future<void> load() async {
    state = const AsyncValue.loading();

    try {
      await ref.read(appReloadServiceProvider).reloadPersistentData();

      state = const AsyncValue.data(null);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }
}

final appBootstrapControllerProvider =
    StateNotifierProvider<AppBootstrapController, AsyncValue<void>>((ref) {
  return AppBootstrapController(ref);
});