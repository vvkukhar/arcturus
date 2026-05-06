import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class RiskBadge extends ConsumerWidget {
  final bool isRisk;

  const RiskBadge({super.key, required this.isRisk});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isRisk
            ? Colors.red.withValues(alpha: 0.15)
            : Colors.green.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        isRisk ? i18n.t('RISK') : i18n.t('SAFE'),
        style: TextStyle(
          color: isRisk ? Colors.red : Colors.green,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}