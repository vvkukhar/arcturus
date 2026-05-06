import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_action_model.dart';
import 'package:lego_trading_manager/features/command_center/presentation/widgets/command_center_counter_badge.dart';

class CommandCenterActionCard extends ConsumerWidget {
  final CommandCenterActionModel action;
  final String? badgeText;
  final VoidCallback onTap;

  const CommandCenterActionCard({
    super.key,
    required this.action,
    required this.badgeText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    
    return Card(
      child: ListTile(
        title: Text(i18n.t(action.title)),
        subtitle: Text(i18n.t(action.subtitle)),
        trailing: badgeText == null
            ? const Icon(Icons.chevron_right)
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CommandCenterCounterBadge(text: badgeText!),
                  const SizedBox(width: 8),
                  const Icon(Icons.chevron_right),
                ],
              ),
        onTap: onTap,
      ),
    );
  }
}