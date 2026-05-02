import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_quality_score_model.dart';

final purchaseQualityScoreProvider =
    Provider.family<PurchaseQualityScoreModel, PurchaseModel>((ref, purchase) {
  double score = 100;

  final total = purchase.finalTotal;
  final shippingShare = total <= 0 ? 0 : purchase.shippingCost / total;
  final extraShare = total <= 0 ? 0 : purchase.additionalCosts / total;

  if (total <= 0) score -= 40;
  if (shippingShare > 0.25) score -= 20;
  if (extraShare > 0.20) score -= 15;
  if ((purchase.source).trim().isEmpty) score -= 15;
  if ((purchase.note ?? '').trim().isEmpty) score -= 5;

  if (score < 0) score = 0;

  final label = score >= 80
      ? 'strong purchase'
      : score >= 55
          ? 'normal purchase'
          : 'weak purchase';

  final explanation = score >= 80
      ? 'Cost structure looks controlled.'
      : score >= 55
          ? 'Purchase is acceptable but should be reviewed.'
          : 'Purchase has weak cost quality or missing data.';

  return PurchaseQualityScoreModel(
    score: score,
    label: label,
    explanation: explanation,
  );
});