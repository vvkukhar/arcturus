import 'package:flutter_riverpod/flutter_riverpod.dart';

class AnalyticsPresetPersistenceNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final analyticsPresetPersistenceProvider =
    NotifierProvider<AnalyticsPresetPersistenceNotifier, String?>(
  AnalyticsPresetPersistenceNotifier.new,
);