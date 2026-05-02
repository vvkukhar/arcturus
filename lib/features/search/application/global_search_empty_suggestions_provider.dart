import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_empty_suggestion_model.dart';

final globalSearchEmptySuggestionsProvider =
    Provider<List<GlobalSearchEmptySuggestionModel>>((ref) {
  return const [
    GlobalSearchEmptySuggestionModel(
      title: 'Try inventory title',
      query: 'ninjago',
    ),
    GlobalSearchEmptySuggestionModel(
      title: 'Try watchlist targets',
      query: 'sealed',
    ),
    GlobalSearchEmptySuggestionModel(
      title: 'Try market source',
      query: 'bricklink',
    ),
    GlobalSearchEmptySuggestionModel(
      title: 'Try sales platform',
      query: 'olx',
    ),
  ];
});
