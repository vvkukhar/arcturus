import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchRecentQueriesController extends Notifier<List<String>> {
  @override
  List<String> build() {
    return const [];
  }

  void add(String query) {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return;
    final next = [trimmed, ...state.where((e) => e != trimmed)];
    state = next.take(8).toList();
  }

  void remove(String query) {
    state = state.where((e) => e != query).toList();
  }

  void clear() {
    state = const [];
  }

  void replaceAll(List<String> items) {
    state = items.take(8).toList();
  }
}

final globalSearchRecentQueriesProvider =
    NotifierProvider<GlobalSearchRecentQueriesController, List<String>>(
  GlobalSearchRecentQueriesController.new,
);