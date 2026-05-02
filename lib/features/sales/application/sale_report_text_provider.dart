import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_report_text_service.dart';

final saleReportTextProvider = Provider<SaleReportTextService>((ref) {
  return const SaleReportTextService();
});