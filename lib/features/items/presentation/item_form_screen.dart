import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/items/data/items_api_repository_provider.dart';

class ItemFormScreen extends ConsumerStatefulWidget {
  const ItemFormScreen({super.key});

  @override
  ConsumerState<ItemFormScreen> createState() => _ItemFormScreenState();
}

class _ItemFormScreenState extends ConsumerState<ItemFormScreen> {
  final _titleController = TextEditingController();
  final _setController = TextEditingController();
  final _themeController = TextEditingController();
  final _yearController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _setController.dispose();
    _themeController.dispose();
    _yearController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(itemsApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Create Item')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Title'),
            ),
            TextField(
              controller: _setController,
              decoration: const InputDecoration(labelText: 'Set Number'),
            ),
            TextField(
              controller: _themeController,
              decoration: const InputDecoration(labelText: 'Theme'),
            ),
            TextField(
              controller: _yearController,
              decoration: const InputDecoration(labelText: 'Year'),
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () async {
                final navigator = Navigator.of(context);

                await repo.createItem(
                  title: _titleController.text,
                  setNumber: _setController.text,
                  theme: _themeController.text,
                  year: int.tryParse(_yearController.text),
                );

                if (!mounted) {
                  return;
                }
                navigator.pop();
              },
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
  }
}