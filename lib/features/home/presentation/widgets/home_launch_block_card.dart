import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/home/application/home_launch_block_provider.dart';

class HomeLaunchBlockCard extends ConsumerWidget {
  final HomeLaunchBlockModel model;
  final VoidCallback onOpenDashboard;

  const HomeLaunchBlockCard({
    super.key,
    required this.model,
    required this.onOpenDashboard,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.blue.withValues(alpha: 0.18),
            Colors.green.withValues(alpha: 0.18),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            model.title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            model.subtitle,
            style: const TextStyle(
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: onOpenDashboard,
            child: Text(i18n.t('home.openDashboard')),
          ),
        ],
      ),
    );
  }
}