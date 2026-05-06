import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppOfflineBanner extends ConsumerWidget {
  const AppOfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Material(
      color: Colors.red.withValues(alpha: 0.15),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Row(
          children: [
            const Icon(Icons.wifi_off),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                i18n.t('offline.banner'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}