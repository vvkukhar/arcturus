import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_default_scope_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_persistence_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_results_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_recent_queries_provider.dart';

final globalSearchPersistenceBootstrapProvider =
    FutureProvider<void>((ref) async {
  final raw = await ref.read(globalSearchPersistenceProvider).read();

  final recent = (raw['recentQueries'] as List<dynamic>? ?? [])
      .map((e) => e.toString())
      .toList();

  final pinnedRaw = raw['pinned'] as List<dynamic>? ?? [];
  final pinned = pinnedRaw.map((e) {
    final map = Map<String, dynamic>.from(e as Map);
    return GlobalSearchPinnedResultModel(
      title: map['title'] as String? ?? '',
      subtitle: map['subtitle'] as String? ?? '',
      type: map['type'] as String? ?? '',
      id: map['id'] as String? ?? '',
    );
  }).toList();

  ref.read(globalSearchRecentQueriesProvider.notifier).replaceAll(recent);
  ref.read(globalSearchPinnedResultsProvider.notifier).replaceAll(pinned);
  ref.read(globalSearchDefaultScopeProvider.notifier).set(
        raw['defaultScope'] as String?,
      );
});