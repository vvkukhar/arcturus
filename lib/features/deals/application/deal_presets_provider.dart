import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_preset_model.dart';

final dealPresetsProvider = Provider<List<DealPresetModel>>((ref) {
  return const [
    DealPresetModel(
      title: 'OLX light',
      feePercent: 0,
      shipping: 80,
      extraCosts: 0,
    ),
    DealPresetModel(
      title: 'Instagram direct',
      feePercent: 0,
      shipping: 70,
      extraCosts: 0,
    ),
    DealPresetModel(
      title: 'BrickLink basic',
      feePercent: 8,
      shipping: 120,
      extraCosts: 0,
    ),
  ];
});
