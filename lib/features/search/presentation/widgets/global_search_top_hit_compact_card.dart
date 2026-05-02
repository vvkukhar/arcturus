import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

class GlobalSearchTopHitCompactCard extends StatelessWidget {
  final GlobalSearchResultModel model;
  final VoidCallback onOpen;

  const GlobalSearchTopHitCompactCard({
    super.key,
    required this.model,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        dense: true,
        title: Text(model.title),
        subtitle: Text('${model.subtitle} • ${model.priorityScore}'),
        trailing: const Icon(Icons.chevron_right),
        onTap: onOpen,
      ),
    );
  }
}