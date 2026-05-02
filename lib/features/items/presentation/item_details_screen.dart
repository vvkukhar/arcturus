import 'package:flutter/material.dart';

class ItemDetailsScreen extends StatelessWidget {
  final Map<String, dynamic> item;

  const ItemDetailsScreen({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(item['title'] ?? 'Item'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Item ID: ${item['id'] ?? ''}'),
            const SizedBox(height: 8),
            Text('Title: ${item['title'] ?? ''}'),
            const SizedBox(height: 8),
            Text('Type: ${item['type'] ?? ''}'),
            const SizedBox(height: 8),
            Text('Created: ${item['createdAt'] ?? ''}'),
          ],
        ),
      ),
    );
  }
}
