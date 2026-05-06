import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';

class PartOutActiveFilterChips extends ConsumerWidget {
  final PartOutFilterModel filter;

  const PartOutActiveFilterChips({
    super.key,
    required this.filter,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final chips = <String>[];

    if (filter.status != null) chips.add('${i18n.t('Status')}: ${i18n.t(filter.status!.name)}');
    if ((filter.titleContains ?? '').trim().isNotEmpty) {
      chips.add('${i18n.t('Title')}: ${filter.titleContains}');
    }
    if (filter.onlyProfitableExpected) chips.add(i18n.t('expected profit'));
    if (filter.onlyProfitableActual) chips.add(i18n.t('actual profit'));
    if (filter.onlyWithNotes) chips.add(i18n.t('with notes'));

    if (chips.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: chips
          .map(
            (chip) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.white10,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(chip),
            ),
          )
          .toList(),
    );
  }
}