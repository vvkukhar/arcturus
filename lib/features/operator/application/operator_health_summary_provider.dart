import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/application/unresolved_summary_provider.dart';
import 'package:lego_trading_manager/features/source_health/application/source_health_summary_provider.dart';

class OperatorHealthSummaryModel {
  final int pendingMatches;
  final int staleSources;
  final int errorSources;
  final String headline;

  const OperatorHealthSummaryModel({
    required this.pendingMatches,
    required this.staleSources,
    required this.errorSources,
    required this.headline,
  });
}

final operatorHealthSummaryProvider =
    FutureProvider<OperatorHealthSummaryModel>((ref) async {
  final unresolved = await ref.watch(unresolvedSummaryProvider.future);
  final sources = await ref.watch(sourceHealthSummaryProvider.future);
  final staleSources = sources
      .where((item) =>
          item.freshnessLabel == 'stale' || item.freshnessLabel == 'missing')
      .length;
  final errorSources = sources
      .where((item) => (item.latestErrorMessage?.isNotEmpty ?? false))
      .length;
  final headline = unresolved.pending > 0
      ? 'Operator queue has pending work'
      : staleSources > 0
          ? 'Some sources are stale'
          : errorSources > 0
              ? 'Some sources reported errors'
              : 'Operator health looks stable';
  return OperatorHealthSummaryModel(
    pendingMatches: unresolved.pending,
    staleSources: staleSources,
    errorSources: errorSources,
    headline: headline,
  );
});
