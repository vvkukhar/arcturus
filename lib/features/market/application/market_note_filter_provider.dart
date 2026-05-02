// lib/features/market/application/market_note_filter_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

final marketNoteFilterProvider =
    StateProvider<MarketNoteFilterModel>((ref) => MarketNoteFilterModel.empty);
