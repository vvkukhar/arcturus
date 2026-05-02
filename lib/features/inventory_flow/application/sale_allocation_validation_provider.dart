import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_validation_model.dart';

final saleAllocationValidationProvider =
    Provider.family<SaleAllocationValidationModel, SaleModel>((ref, sale) {
  final allocation = ref.watch(saleAllocationSummaryProvider(sale));

  if (!allocation.hasAllocation) {
    return const SaleAllocationValidationModel(
      isValid: false,
      label: 'unallocated',
      warning: 'No stock allocated to this sale.',
    );
  }

  if (allocation.allocatedQuantity < sale.quantity) {
    return SaleAllocationValidationModel(
      isValid: false,
      label: 'partial allocation',
      warning:
          'Allocated ${allocation.allocatedQuantity} of ${sale.quantity} sold units.',
    );
  }

  if (allocation.allocatedQuantity > sale.quantity) {
    return SaleAllocationValidationModel(
      isValid: false,
      label: 'overallocated',
      warning:
          'Allocated ${allocation.allocatedQuantity}, but sale quantity is ${sale.quantity}.',
    );
  }

  return const SaleAllocationValidationModel(
    isValid: true,
    label: 'fully allocated',
  );
});