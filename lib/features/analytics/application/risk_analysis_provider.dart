import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'risk_analysis_service.dart';

final riskAnalysisProvider = Provider(
  (ref) => RiskAnalysisService(),
);
