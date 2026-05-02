import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_default_scope_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_persistence_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_results_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_recent_queries_provider.dart';

class GlobalSearchPersistHelper {
  final Ref ref;

  GlobalSearchPersistHelper(this.ref);

  Future<void> save() async {
    final recent = ref.read(globalSearchRecentQueriesProvider);
    final pinned = ref.read(globalSearchPinnedResultsProvider);
    final defaultScope = ref.read(globalSearchDefaultScopeProvider);

    await ref.read(globalSearchPersistenceProvider).write({
      'recentQueries': recent,
      'pinned': pinned
          .map(
            (e) => {
              'title': e.title,
              'subtitle': e.subtitle,
              'type': e.type,
              'id': e.id,
            },
          )
          .toList(),
      'defaultScope': defaultScope,
    });
  }
}

final globalSearchPersistHelperProvider = Provider<GlobalSearchPersistHelper>(
  (ref) => GlobalSearchPersistHelper(ref),
);
