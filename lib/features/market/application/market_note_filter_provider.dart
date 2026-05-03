import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

class MarketNoteFilterNotifier extends Notifier<MarketNoteFilterModel> {
  @override
  MarketNoteFilterModel build() => MarketNoteFilterModel.empty;

  void set(MarketNoteFilterModel value) {
    state = value;
  }
}

final marketNoteFilterProvider =
    NotifierProvider<MarketNoteFilterNotifier, MarketNoteFilterModel>(
  MarketNoteFilterNotifier.new,
);