import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'simple_metrics_service.dart';

final simpleMetricsProvider = Provider(
  (ref) => SimpleMetricsService(),
);
