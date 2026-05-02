import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rates_loader_provider.dart';

final officialRatesCountProvider = FutureProvider<int>((ref) async {
  final rates = await ref.read(officialRatesLoaderServiceProvider).load();
  return rates.length;
});