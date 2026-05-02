class DeadStockCenterActionService {
  String description(String actionKey) {
    switch (actionKey) {
      case 'critical_reprice':
        return 'Immediately reduce prices on the most overdue items.';
      case 'warning_review':
        return 'Review medium-aged items before they become dead stock.';
      case 'open_inventory_aging':
        return 'Open inventory and sort by aging.';
      default:
        return 'No action';
    }
  }
}
