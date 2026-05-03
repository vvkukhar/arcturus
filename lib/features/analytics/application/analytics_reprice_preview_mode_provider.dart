import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AnalyticsRepricePreviewMode {
  cards,
  table,
}

class AnalyticsRepricePreviewModeNotifier extends Notifier<AnalyticsRepricePreviewMode> {
  @override
  AnalyticsRepricePreviewMode build() => AnalyticsRepricePreviewMode.cards;

  void set(AnalyticsRepricePreviewMode value) {
    state = value;
  }
}

final analyticsRepricePreviewModeProvider =
    NotifierProvider<AnalyticsRepricePreviewModeNotifier, AnalyticsRepricePreviewMode>(
  AnalyticsRepricePreviewModeNotifier.new,
);