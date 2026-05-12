import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AiInsightCard extends ConsumerWidget {
  final Map<String, dynamic> analysis;
  const AiInsightCard({super.key, required this.analysis});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.indigoAccent.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.indigoAccent.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: Colors.indigoAccent, size: 20),
              const SizedBox(width: 8),
              Text('AI VERDICT', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.indigoAccent.withValues(alpha: 0.8))),
            ],
          ),
          const SizedBox(height: 12),
          Text(analysis['verdict'] ?? 'No verdict available', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(analysis['details'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 13)),
        ],
      ),
    );
  }
}