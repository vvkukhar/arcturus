import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

final globalSearchFindPinnedAsResultProvider =
    Provider.family<GlobalSearchResultModel?, GlobalSearchPinnedResultModel>(
  (ref, pinned) {
    final all = ref.watch(globalSearchProvider);

    for (final item in all) {
      if (item.id == pinned.id && item.type == pinned.type) {
        return GlobalSearchResultModel(
          title: item.title,
          subtitle: item.subtitle,
          type: item.type,
          route: item.route,
          id: item.id,
          payload: item.payload,
          priorityScore: item.priorityScore,
        );
      }
    }

    return null;
  },
);