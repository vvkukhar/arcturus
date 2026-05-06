import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AnalyticsStatTile extends ConsumerWidget {
  final String title;
  final String value;
  final String subtitle;

  const AnalyticsStatTile({
    super.key,
    required this.title,
    required this.value,
    required this.subtitle,
  });

  Color? _valueColor(BuildContext context) {
    final normalized = value.toLowerCase();

    if (normalized.contains('-')) {
      return Colors.redAccent;
    }

    if (title.toLowerCase().contains('profit')) {
      return Colors.green;
    }

    return null;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final valueColor = _valueColor(context);
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(i18n.t(title)),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: valueColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              i18n.t(subtitle),
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}