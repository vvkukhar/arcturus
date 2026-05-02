import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_api_repository_provider.dart';

class SourceHealthSummaryItemModel {
  final String sourceCode;
  final String sourceName;
  final bool enabled;
  final int listingCount;
  final String latestRunStatus;
  final String freshnessLabel;
  final String? latestErrorMessage;

  const SourceHealthSummaryItemModel({
    required this.sourceCode,
    required this.sourceName,
    required this.enabled,
    required this.listingCount,
    required this.latestRunStatus,
    required this.freshnessLabel,
    required this.latestErrorMessage,
  });

  factory SourceHealthSummaryItemModel.fromJson(Map<String, dynamic> json) {
    return SourceHealthSummaryItemModel(
      sourceCode: json['sourceCode'] as String? ?? '',
      sourceName: json['sourceName'] as String? ?? '',
      enabled: json['enabled'] as bool? ?? false,
      listingCount: (json['listingCount'] as num?)?.toInt() ?? 0,
      latestRunStatus: json['latestRunStatus'] as String? ?? 'never',
      freshnessLabel: json['freshnessLabel'] as String? ?? 'missing',
      latestErrorMessage: json['latestErrorMessage'] as String?,
    );
  }
}

final sourceHealthSummaryProvider =
    FutureProvider<List<SourceHealthSummaryItemModel>>((ref) async {
  final repository = ref.watch(sourceHealthApiRepositoryProvider);
  final json = await repository.getSummary();
  return json.map(SourceHealthSummaryItemModel.fromJson).toList();
});