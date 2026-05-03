import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';

class GlobalSearchPinnedResultsController extends Notifier<List<GlobalSearchPinnedResultModel>> {
  @override
  List<GlobalSearchPinnedResultModel> build() {
    return const [];
  }

  void pin(GlobalSearchPinnedResultModel item) {
    final next = [
      item,
      ...state.where((e) => !(e.id == item.id && e.type == item.type)),
    ];
    state = next.take(12).toList();
  }

  void unpin(String id, String type) {
    state = state.where((e) => !(e.id == id && e.type == type)).toList();
  }

  bool isPinned(String id, String type) {
    return state.any((e) => e.id == id && e.type == type);
  }

  void replaceAll(List<GlobalSearchPinnedResultModel> items) {
    state = items.take(12).toList();
  }
}

final globalSearchPinnedResultsProvider =
    NotifierProvider<GlobalSearchPinnedResultsController, List<GlobalSearchPinnedResultModel>>(
  GlobalSearchPinnedResultsController.new,
);