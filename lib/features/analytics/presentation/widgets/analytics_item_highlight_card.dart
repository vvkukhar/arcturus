import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class AnalyticsItemHighlightCard extends ConsumerWidget {
  final ItemModel item;
  final String trailingText;
  final String subtitleText;

  const AnalyticsItemHighlightCard({
    super.key,
    required this.item,
    required this.trailingText,
    required this.subtitleText,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(i18n.t(subtitleText)),
        trailing: Text(
          i18n.t(trailingText),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}