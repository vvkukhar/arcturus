import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'profit_insights_service.dart';

final profitInsightsProvider = Provider(
  (ref) => ProfitInsightsService(),
);
