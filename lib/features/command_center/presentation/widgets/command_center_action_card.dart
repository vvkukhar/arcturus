import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_action_model.dart';
import 'package:lego_trading_manager/features/command_center/presentation/widgets/command_center_counter_badge.dart';

class CommandCenterActionCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(action.title),
        subtitle: Text(action.subtitle),
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
