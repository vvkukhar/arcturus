import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class StatusBadge extends ConsumerWidget {
  final ItemStatus status;

  const StatusBadge({
    super.key,
    required this.status,
  });

  Color _color() {
    switch (status) {
      case ItemStatus.sold:
        return Colors.green;
      case ItemStatus.listed:
        return Colors.blue;
      case ItemStatus.archived:
        return Colors.grey;
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        i18n.t(status.name),
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}