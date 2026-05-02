import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_quality_score_model.dart';

final saleQualityScoreProvider =
    Provider.family<SaleQualityScoreModel, SaleModel>((ref, sale) {
  double score = 100;

  final gross = sale.salePrice;
  final feeShare = gross <= 0 ? 0 : sale.platformFee / gross;
  final shippingShare = gross <= 0 ? 0 : sale.shippingByMe / gross;
  final netShare = gross <= 0 ? 0 : sale.finalNet / gross;

  if (gross <= 0) score -= 40;
  if (sale.quantity <= 0) score -= 30;
  if (sale.finalNet <= 0) score -= 35;
  if (sale.unitNet <= 0) score -= 20;
  if (feeShare > 0.18) score -= 15;
  if (shippingShare > 0.20) score -= 15;
  if (netShare < 0.60) score -= 10;
  if (sale.quantity > 1 && sale.unitNet < 50) score -= 10;
  if (sale.platform.trim().isEmpty) score -= 10;
  if ((sale.note ?? '').trim().isEmpty) score -= 5;

  if (score < 0) score = 0;

  final label = score >= 80
      ? 'strong sale'
      : score >= 55
          ? 'normal sale'
          : 'weak sale';

  final explanation = score >= 80
      ? 'Net structure and unit economics look healthy.'
      : score >= 55
          ? 'Sale is acceptable, but unit economics or costs should be reviewed.'
          : 'Sale has weak net quality, high cost pressure, or poor unit economics.';

  return SaleQualityScoreModel(
    score: score,
    label: label,
    explanation: explanation,
  );
});