import 'package:flutter/material.dart';

class AnalyticsAutoRulesExecuteBar extends StatelessWidget {
  final VoidCallback onExecute;

  const AnalyticsAutoRulesExecuteBar({
    super.key,
    required this.onExecute,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Expanded(
              child: Text(
                'Run enabled auto-rules',
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            FilledButton(
              onPressed: onExecute,
              child: const Text('Execute'),
            ),
          ],
        ),
      ),
    );
  }
}
