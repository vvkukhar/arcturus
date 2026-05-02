import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage.dart';

final localJsonStorageProvider = Provider<LocalJsonStorage>((ref) {
  return const LocalJsonStorage();
});