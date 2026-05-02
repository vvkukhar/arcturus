import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_unmatched_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sales_unmatched_summary_model.dart';

final salesUnmatchedSummaryProvider = Provider<SalesUnmatchedSummaryModel>((ref) {
  final unmatched = ref.watch(salesUnmatchedProvider);

  final unmatchedUnits = unmatched.fold<int>(
    0,
    (sum, sale) => sum + sale.quantity,
  );

  final unmatchedNet = unmatched.fold<double>(
    0,
    (sum, sale) => sum + sale.finalNet,
  );

  final label = unmatched.isEmpty
      ? 'All sales are linked'
      : 'Some sales need purchase links or stock allocation';

  return SalesUnmatchedSummaryModel(
    unmatchedCount: unmatched.length,
    unmatchedUnits: unmatchedUnits,
    unmatchedNet: unmatchedNet,
    label: label,
  );
});