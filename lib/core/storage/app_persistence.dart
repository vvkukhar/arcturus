import 'dart:async';
import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

class AppPersistence {
  final StorePersistenceManager manager;
  Timer? _timer;

  AppPersistence(this.manager);

  void scheduleSave() {
    _timer?.cancel();
    _timer = Timer(const Duration(milliseconds: 300), () async {
      await manager.persistAll();
    });
  }

  Future<void> flushNow() async {
    _timer?.cancel();
    await manager.persistAll();
  }
}