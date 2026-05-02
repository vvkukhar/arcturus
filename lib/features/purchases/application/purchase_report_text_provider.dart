import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_report_text_service.dart';

final purchaseReportTextProvider = Provider<PurchaseReportTextService>((ref) {
  return const PurchaseReportTextService();
});