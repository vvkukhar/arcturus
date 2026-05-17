import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ImageGalleryScreen extends ConsumerStatefulWidget {
  final InventoryItemModel item; // ФІКС: InventoryItemModel
  final int initialIndex;

  const ImageGalleryScreen({super.key, required this.item, required this.initialIndex});

  @override
  ConsumerState<ImageGalleryScreen> createState() => _ImageGalleryScreenState();
}

class _ImageGalleryScreenState extends ConsumerState<ImageGalleryScreen> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
  }

  void _deleteImage(I18nNotifier i18n) async {
    final currentImage = widget.item.images[_currentIndex];
    
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(i18n.t('gallery.delete')),
        content: Text(i18n.t('gallery.deleteConfirm')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(i18n.t('common.cancel'))),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(ctx, true), 
            child: Text(i18n.t('common.delete')),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await ref.read(inventoryEngineProvider.notifier).deleteImage(currentImage['id']); // ФІКС MAP SYNTAX
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(i18n.t('gallery.deleted'))));
          Navigator.pop(context); 
        }
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
      }
    }
  }

  void _setMain(I18nNotifier i18n) async {
    final currentImage = widget.item.images[_currentIndex];
    if (currentImage['isPrimary'] == true) return; 

    try {
      await ref.read(inventoryEngineProvider.notifier).setMainImage(currentImage['id']);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(i18n.t('gallery.mainSet')), backgroundColor: Colors.green));
        Navigator.pop(context); 
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);
    final images = widget.item.images;

    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.black54,
        elevation: 0,
        title: Text('${_currentIndex + 1} / ${images.length}'),
      ),
      body: PageView.builder(
        controller: _pageController,
        onPageChanged: (idx) => setState(() => _currentIndex = idx),
        itemCount: images.length,
        itemBuilder: (context, index) {
          final img = images[index];
          return InteractiveViewer(
            minScale: 0.5,
            maxScale: 4.0,
            child: Hero(
              tag: img['id'],
              child: Image.network(
                img['imageUrl'],
                fit: BoxFit.contain,
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          color: Colors.black54,
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: images[_currentIndex]['isPrimary'] == true ? null : () => _setMain(i18n),
                  icon: const Icon(Icons.star),
                  label: Text(images[_currentIndex]['isPrimary'] == true ? 'Main' : i18n.t('gallery.setMain')),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: FilledButton.icon(
                  style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
                  onPressed: () => _deleteImage(i18n),
                  icon: const Icon(Icons.delete),
                  label: Text(i18n.t('gallery.delete')),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}