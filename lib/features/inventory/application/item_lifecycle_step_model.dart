// lib/features/inventory/application/item_lifecycle_step_model.dart

class ItemLifecycleStepModel {
  final String key;
  final String label;
  final bool active;

  const ItemLifecycleStepModel({
    required this.key,
    required this.label,
    required this.active,
  });
}
