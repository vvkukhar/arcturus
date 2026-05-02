import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_replay_action_model.dart';

class ActivityReplayCard extends StatelessWidget {
  final List<ActivityReplayActionModel> items;

  const ActivityReplayCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Replay cues',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child:
                        Text('${item.type} • ${item.title} • ${item.subtitle}'),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
