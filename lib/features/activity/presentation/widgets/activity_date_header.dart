import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityDateHeader extends ConsumerWidget {
  final DateTime date;

  const ActivityDateHeader({
    super.key,
    required this.date,
  });

  String _label(I18nNotifier i18n) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(date.year, date.month, date.day);
    final diff = today.difference(target).inDays;

    if (diff == 0) return i18n.t('Today');
    if (diff == 1) return i18n.t('Yesterday');
    return date.toIso8601String().split('T').first;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 10),
      child: Text(
        _label(i18n),
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}