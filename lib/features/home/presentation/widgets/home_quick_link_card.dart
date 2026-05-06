import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/home/application/home_quick_link_model.dart';

class HomeQuickLinkCard extends ConsumerWidget {
  final HomeQuickLinkModel model;
  final VoidCallback onTap;

  const HomeQuickLinkCard({
    super.key,
    required this.model,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(i18n.t(model.title)),
        subtitle: Text(i18n.t(model.subtitle)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}