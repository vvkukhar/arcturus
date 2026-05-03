import 'package:flutter_riverpod/flutter_riverpod.dart';

class WatchlistAvailableCashNotifier extends Notifier<double> {
  @override
  double build() => 0.0;

  void set(double value) => state = value;
}

final watchlistAvailableCashProvider =
    NotifierProvider<WatchlistAvailableCashNotifier, double>(
  WatchlistAvailableCashNotifier.new,
);