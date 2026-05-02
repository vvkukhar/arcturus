import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';

class GlobalSearchPersistenceService {
  final Ref ref;
  static const _key = 'global_search_state';

  GlobalSearchPersistenceService(this.ref);

  Future<Map<String, dynamic>> read() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return {};
    return Map<String, dynamic>.from(jsonDecode(raw) as Map);
  }

  Future<void> write(Map<String, dynamic> value) async {
    await ref.read(cacheRepositoryProvider).set(
          _key,
          jsonEncode(value),
        );
  }
}
