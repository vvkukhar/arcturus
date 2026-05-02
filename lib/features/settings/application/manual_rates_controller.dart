import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class ManualRatesController
    extends StateNotifier<List<ManualCurrencyRateModel>> {
  ManualRatesController() : super(const []);

  void load() {
    state = [...state];
  }

  void add(ManualCurrencyRateModel item) {
    final next = [...state];
    final index = next.indexWhere((e) => e.code == item.code);

    if (index == -1) {
      next.add(item);
    } else {
      next[index] = item;
    }

    state = next;
  }

  void remove(String code) {
    state = state.where((e) => e.code != code).toList();
  }

  void replaceAll(List<ManualCurrencyRateModel> items) {
    state = [...items];
  }

  void clear() {
    state = const [];
  }
}

final manualRatesControllerProvider =
    StateNotifierProvider<ManualRatesController, List<ManualCurrencyRateModel>>(
  (ref) => ManualRatesController(),
);