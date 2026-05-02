import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';

class UnresolvedSummaryModel {
  final int pending;
  final int resolved;
  final int dismissed;

  const UnresolvedSummaryModel({
    required this.pending,
    required this.resolved,
    required this.dismissed,
  });

  factory UnresolvedSummaryModel.fromJson(Map<String, dynamic> json) {
    return UnresolvedSummaryModel(
      pending: (json['pending'] as num?)?.toInt() ?? 0,
      resolved: (json['resolved'] as num?)?.toInt() ?? 0,
      dismissed: (json['dismissed'] as num?)?.toInt() ?? 0,
    );
  }
}

final unresolvedSummaryProvider = FutureProvider<UnresolvedSummaryModel>((
  ref,
) async {
  final repository = ref.watch(operatorApiRepositoryProvider);
  final json = await repository.getUnresolvedSummary();
  return UnresolvedSummaryModel.fromJson(json);
});
