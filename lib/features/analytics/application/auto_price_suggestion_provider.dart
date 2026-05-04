import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_model.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_service.dart';

final autoPriceSuggestionServiceProvider =
    Provider<AutoPriceSuggestionService>((ref) {
  return AutoPriceSuggestionService();
});

final autoPriceSuggestionsProvider =
    Provider<List<AutoPriceSuggestionModel>>((ref) {
  final service = ref.watch(autoPriceSuggestionServiceProvider);
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  final result =
      items.map(service.build).whereType<AutoPriceSuggestionModel>().toList();

  result.sort((a, b) {
    final aDiff = (a.suggestedPrice - a.currentExpected).abs();
    final bDiff = (b.suggestedPrice - b.currentExpected).abs();
    return bDiff.compareTo(aDiff);
  });

  return result;
});