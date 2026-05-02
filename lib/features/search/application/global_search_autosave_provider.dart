import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_persist_helper_provider.dart';

final globalSearchAutosaveProvider = Provider<void Function()>((ref) {
  return () {
    Future.microtask(() async {
      await ref.read(globalSearchPersistHelperProvider).save();
    });
  };
});
