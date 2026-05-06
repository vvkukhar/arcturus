import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';

class PurchasesActiveFilterChips extends ConsumerWidget {
  final PurchasesFilterModel filter;

  const PurchasesActiveFilterChips({
    super.key,
    required this.filter,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final chips = <String>[];

    if ((filter.sourceContains ?? '').trim().isNotEmpty) {
      chips.add('${i18n.t('source')}: ${filter.sourceContains}');
    }

    if ((filter.currency ?? '').trim().isNotEmpty) {
      chips.add('${i18n.t('currency')}: ${filter.currency}');
    }

    if (filter.minTotal != null) {
      chips.add('${i18n.t('min')}: ${filter.minTotal!.toStringAsFixed(2)}');
    }

    if (filter.maxTotal != null) {
      chips.add('${i18n.t('max')}: ${filter.maxTotal!.toStringAsFixed(2)}');
    }

    if (chips.isEmpty) return const SizedBox.shrink();

    return Align(
      alignment: Alignment.centerLeft,
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: chips
            .map(
              (text) => Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.white10,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(text),
              ),
            )
            .toList(),
      ),
    );
  }
}