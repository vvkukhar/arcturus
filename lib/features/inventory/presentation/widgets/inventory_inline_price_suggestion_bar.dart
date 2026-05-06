import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_inline_price_suggestion_model.dart';

class InventoryInlinePriceSuggestionBar extends ConsumerWidget {
  final InventoryInlinePriceSuggestionModel? model;
  final VoidCallback? onApply;

  const InventoryInlinePriceSuggestionBar({
    super.key,
    required this.model,
    this.onApply,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (model == null || !model!.hasSuggestion) {
      return const SizedBox.shrink();
    }
    final i18n = ref.watch(i18nProvider.notifier);
    final positive = model!.delta >= 0;
    final color = positive ? Colors.green : Colors.orange;
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              '${i18n.t('Suggested:')} ${model!.suggestedPrice.toStringAsFixed(2)} (${positive ? '+' : ''}${model!.delta.toStringAsFixed(2)})',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          if (onApply != null)
            TextButton(
              onPressed: onApply,
              child: Text(i18n.t('common.apply')),
            ),
        ],
      ),
    );
  }
}