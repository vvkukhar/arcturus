import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class NbuApiNoteCard extends ConsumerWidget {
  const NbuApiNoteCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          i18n.t('Official NBU rates are used as primary source. If request fails, cached data should be used as fallback. Manual rates are emergency override only.'),
        ),
      ),
    );
  }
}