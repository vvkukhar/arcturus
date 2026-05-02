import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/planning/data/planning_api_repository_provider.dart';

class DailyPlanTaskModel {
  final int order;
  final String type;
  final String title;
  final String reason;

  const DailyPlanTaskModel({
    required this.order,
    required this.type,
    required this.title,
    required this.reason,
  });

  factory DailyPlanTaskModel.fromJson(Map<String, dynamic> json) {
    return DailyPlanTaskModel(
      order: json['order'] as int? ?? 0,
      type: json['type'] as String? ?? '',
      title: json['title'] as String? ?? '',
      reason: json['reason'] as String? ?? '',
    );
  }
}

final dailyPlanProvider =
    FutureProvider<List<DailyPlanTaskModel>>((ref) async {
  final repo = ref.watch(planningApiRepositoryProvider);
  final json = await repo.getDailyPlan();
  return json.map(DailyPlanTaskModel.fromJson).toList();
});