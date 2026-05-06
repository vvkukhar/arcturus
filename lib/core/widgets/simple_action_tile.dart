import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SimpleActionTile extends ConsumerWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final IconData? icon;

  const SimpleActionTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.icon,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        leading: icon == null ? null : Icon(icon),
        title: Text(i18n.t(title)),
        subtitle: Text(i18n.t(subtitle)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}