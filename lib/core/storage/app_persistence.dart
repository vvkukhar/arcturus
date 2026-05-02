// lib/core/storage/app_persistence.dart

import 'dart:async';

import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

class AppPersistence {
  AppPersistence._();

  static final AppPersistence instance = AppPersistence._();

  final StorePersistenceManager _manager = StorePersistenceManager();

  Timer? _timer;

  void scheduleSave() {
    _timer?.cancel();
    _timer = Timer(const Duration(milliseconds: 300), () async {
      await _manager.persistAll();
    });
  }

  Future<void> flushNow() async {
    _timer?.cancel();
    await _manager.persistAll();
  }
}
