import 'package:lego_trading_manager/core/storage/store_persistence.dart';

class AppBootstrap {
  static Future<void> ensureInitialized() async {
    await StorePersistence.instance.bootstrap();
  }
}
