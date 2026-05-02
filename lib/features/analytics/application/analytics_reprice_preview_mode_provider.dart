import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AnalyticsRepricePreviewMode {
  cards,
  table,
}

final analyticsRepricePreviewModeProvider =
    StateProvider<AnalyticsRepricePreviewMode>(
  (ref) => AnalyticsRepricePreviewMode.cards,
);