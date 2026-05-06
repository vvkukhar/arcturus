import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class PartOutLineCard extends ConsumerWidget {
  final PartOutLineModel line;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  const PartOutLineCard({
    super.key,
    required this.line,
    this.onTap,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      line.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text('${i18n.t(line.itemType.name)} • ${i18n.t(line.status.name)}'),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 12,
                      runSpacing: 8,
                      children: [
                        Text('${i18n.t('inv.qty')}: ${line.quantity}'),
                        Text('${i18n.t('Expected')}: ${line.expectedTotalPrice.toStringAsFixed(2)}'),
                        Text('${i18n.t('Actual')}: ${line.actualTotalPrice.toStringAsFixed(2)}'),
                      ],
                    ),
                  ],
                ),
              ),
              if (onDelete != null)
                IconButton(
                  onPressed: onDelete,
                  icon: const Icon(Icons.delete_outline),
                ),
            ],
          ),
        ),
      ),
    );
  }
}