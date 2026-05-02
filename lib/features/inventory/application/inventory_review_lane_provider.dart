import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_lane_model.dart';

final inventoryReviewLaneProvider = Provider<InventoryReviewLaneModel>((ref) {
  return const InventoryReviewLaneModel(
    urgent: 3,
    normal: 8,
    backlog: 5,
  );
});