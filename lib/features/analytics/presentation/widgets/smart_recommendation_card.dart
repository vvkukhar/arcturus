import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_model.dart';

class SmartRecommendationCard extends ConsumerWidget {
  final SmartRecommendationModel model;

  const SmartRecommendationCard({
    super.key,
    required this.model,
  });

  Color _color() {
    switch (model.severity) {
      case 'good':
        return Colors.green;
      case 'warning':
        return Colors.orange;
      case 'danger':
        return Colors.red;
      default:
        return Colors.blueGrey;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final color = _color();

    return Card(
      child: ListTile(
        leading: Icon(Icons.tips_and_updates_outlined, color: color),
        title: Text(i18n.t(model.title)),
        subtitle: Text(i18n.t(model.message)),
      ),
    );
  }
}